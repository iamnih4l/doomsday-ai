require('dotenv').config({ path: '.env.local' }); // Try .env.local first
require('dotenv').config(); // Fallback to .env

const http = require('http');
// Use https for production URLs if needed, but this script is likely for local dev or localhost usage.
// If targeting production from local, we might need https module.
// Assuming this is for LOCAL testing as per package.json "cron:news": "node scripts/trigger-news.js" usually implies local or simple trigger.
// However, the user wants to avoid manual triggering. 

// Let's make this script robust: usage: node trigger-news.js [url]
const targetUrl = process.env.VERCEL_PROJECT_URL || 'http://localhost:3000';
console.log(`Triggering news ingestion at: ${targetUrl}`);

const url = new URL(targetUrl);
const isHttps = url.protocol === 'https:';
const client = isHttps ? require('https') : require('http');

const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: '/api/news/ingest',
    method: 'POST',
    headers: {
        'x-admin-key': process.env.ADMIN_API_KEY,
        'Content-Type': 'application/json'
    }
};

const req = client.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => data += chunk);

    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
            const parsed = JSON.parse(data);
            console.log('Response:', JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log('Response (raw):', data);
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Ingestion triggered successfully');
            process.exit(0);
        } else {
            console.error('❌ Ingestion failed');
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Problem with request: ${e.message}`);
    process.exit(1);
});

req.end();
