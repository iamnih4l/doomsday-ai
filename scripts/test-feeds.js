require('dotenv').config();

// Mock mongoose to prevent DB connection errors during simple logic test
const mongoose = require('mongoose');
mongoose.connect = async () => console.log('Mock DB connected');
mongoose.model = () => ({
    create: async (data) => {
        console.log('Mock DB Create:', data.title || 'Risk Entry');
        return { ...data, _id: 'mock_id' };
    },
    find: async () => [],
    updateMany: async () => { }
});

// We need to use Babel or similar if we want to import the ES modules directly in Node.
// Since we can't easily set up Babel here, I will try to replicate the logic or use the existing compilation if available.
// Actually, `lib` uses `import/export`. Node.js might fail without "type": "module" in package.json or .mjs extension.
// Let's check package.json again. It doesn't have "type": "module".
// So running `node scripts/test-news-service.js` will fail if I import ES modules.

// Instead of importing, I will reimplement the fetch logic using rss-parser directly in this script
// just to verify the RSS feeds are working. This isolates the network/parsing issue from the code structure.

const Parser = require('rss-parser');
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

async function testFeeds() {
    console.log('Testing RSS Feeds...');
    for (const feed of RSS_FEEDS) {
        try {
            console.log(`Fetching ${feed.source} (${feed.url})...`);
            const feedData = await parser.parseURL(feed.url);
            console.log(`Success: fetched ${feedData.items.length} items`);

            const relevantItems = feedData.items.filter(item => {
                const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
                return RISK_KEYWORDS.some(keyword => text.includes(keyword));
            });
            console.log(`Found ${relevantItems.length} relevant items`);
        } catch (error) {
            console.error(`FAILED to parse feed ${feed.url}:`, error.message);
        }
    }
}

testFeeds();
