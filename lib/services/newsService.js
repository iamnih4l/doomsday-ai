import Parser from 'rss-parser';
import { RiskIngestionService } from './riskIngestionService';
import HeadlineHash from '@/models/HeadlineHash';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db';

const parser = new Parser({
    timeout: 10000, // 10s timeout for graceful failing
});

const RSS_FEEDS = [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World News' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian' },
    { url: 'https://rss.dw.com/rdf/rss-en-world', source: 'Deutsche Welle' },
    { url: 'https://feeds.npr.org/1004/rss.xml', source: 'NPR World' }
];

export class NewsService {
    static async fetchAndIngestNews() {
        await connectToDatabase();
        let ingestedCount = 0;
        const errors = [];
        const thresholdDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

        for (const feed of RSS_FEEDS) {
            try {
                const feedData = await parser.parseURL(feed.url);

                for (const item of feedData.items) {
                    const pubDate = new Date(item.pubDate || Date.now());

                    // Filter: Only last 24h headlines
                    if (pubDate < thresholdDate) continue;

                    const title = item.title || '';
                    const content = item.contentSnippet || '';
                    const fullText = `${title} ${content}`.trim();

                    if (!fullText) continue;

                    // Deduplicate using SHA256 hash of headline text
                    const hash = crypto.createHash('sha256').update(fullText).digest('hex');

                    // Check if already processed
                    const existingHash = await HeadlineHash.findOne({ hash });
                    if (existingHash) {
                        continue;
                    }

                    // Save the hash to prevent reprocessing
                    await HeadlineHash.create({ hash });

                    // Basic categorization fallback to satisfy RiskInput enum,
                    // actual mathematical scoring will happen in aiService
                    const category = this.detectCategory(fullText.toLowerCase());

                    await RiskIngestionService.ingestRisk({
                        category: category,
                        severity: 0, // Math engine will compute actual score
                        confidence: 0, // Math engine computes confidence later
                        source: `${feed.source}: ${title}`,
                        description: content.substring(0, 500) || title,
                        timestamp: pubDate,
                    });

                    ingestedCount++;
                }

            } catch (error) {
                console.error(`Failed to parse feed ${feed.url}:`, error);
                // Graceful handling if RSS feed fails
                errors.push({ source: feed.source, error: error.message });
            }
        }

        return { ingestedCount, errors };
    }

    static detectCategory(text) {
        if (text.includes('nuclear') || text.includes('missile') || text.includes('war')) return 'Nuclear';
        if (text.includes('climate') || text.includes('flood') || text.includes('heat')) return 'Climate';
        if (text.includes('virus') || text.includes('pandemic') || text.includes('health')) return 'Biosecurity';
        if (text.includes('ai') || text.includes('cyber') || text.includes('tech')) return 'AI';
        if (text.includes('geopolitic') || text.includes('conflict')) return 'Geopolitical';
        return 'Other';
    }
}
