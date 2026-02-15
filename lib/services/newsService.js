import Parser from 'rss-parser';
import { RiskIngestionService } from './riskIngestionService';

const parser = new Parser();

const RSS_FEEDS = [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World News' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian' },
];

const RISK_KEYWORDS = [
    'nuclear', 'war', 'climate change', 'pandemic', 'virus',
    'ai safety', 'artificial intelligence', 'cyberattack',
    'geopolitical', 'conflict', 'missile', 'famine', 'drought'
];

// Basic region mapping (AI will do better, this is a fallback)
const REGION_KEYWORDS = {
    'ukraine': { region: 'Eastern Europe', lat: 48.37, lng: 31.16 },
    'russia': { region: 'Eastern Europe', lat: 61.52, lng: 105.31 },
    'gaza': { region: 'Middle East', lat: 31.35, lng: 34.30 },
    'israel': { region: 'Middle East', lat: 31.04, lng: 34.85 },
    'china': { region: 'Asia Pacific', lat: 35.86, lng: 104.19 },
    'taiwan': { region: 'Asia Pacific', lat: 23.69, lng: 120.96 },
    'usa': { region: 'North America', lat: 37.09, lng: -95.71 },
    'eu': { region: 'Europe', lat: 54.52, lng: 15.25 },
};

export class NewsService {
    static async fetchAndIngestNews() {
        let ingestedCount = 0;
        const errors = [];

        for (const feed of RSS_FEEDS) {
            try {
                const feedData = await parser.parseURL(feed.url);

                const relevantItems = feedData.items.filter(item => {
                    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
                    return RISK_KEYWORDS.some(keyword => text.includes(keyword));
                });

                for (const item of relevantItems) {
                    const fullText = (item.title + ' ' + item.contentSnippet).toLowerCase();
                    const category = this.detectCategory(fullText);
                    const location = this.detectLocation(fullText);

                    await RiskIngestionService.ingestRisk({
                        category: category,
                        severity: 50,
                        confidence: 0.6,
                        source: `${feed.source}: ${item.title}`,
                        description: item.contentSnippet?.substring(0, 500) || item.title,
                        timestamp: new Date(item.pubDate || Date.now()),
                        // Add location data
                        region: location?.region,
                        coordinates: location ? { lat: location.lat, lng: location.lng } : undefined
                    });
                    ingestedCount++;
                }

            } catch (error) {
                console.error(`Failed to parse feed ${feed.url}:`, error);
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
        return 'Geopolitical';
    }

    static detectLocation(text) {
        for (const [keyword, data] of Object.entries(REGION_KEYWORDS)) {
            if (text.includes(keyword)) return data;
        }
        return null;
    }
}
