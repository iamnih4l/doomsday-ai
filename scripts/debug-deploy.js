require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const https = require('https');

const BASE_URL = 'https://doomsday-ai-lzee.vercel.app';
const ADMIN_KEY = process.env.ADMIN_API_KEY;

console.log(`🔍 Debugging Deployment: ${BASE_URL}`);

function request(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const opts = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': ADMIN_KEY,
                ...options.headers
            }
        };

        const req = https.request(url, opts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, data: data });
            });
        });

        req.on('error', reject);
        if (options.body) req.write(JSON.stringify(options.body));
        req.end();
    });
}

async function runDebug() {
    try {
        // 1. Check Public Clock endpoint (Does DB Read work?)
        console.log('\n1️⃣  Testing /api/clock/current (DB Read)...');
        const clock = await request('/api/clock/current');
        console.log(`Status: ${clock.status}`);
        console.log(`Response: ${clock.data.substring(0, 100)}...`);

        if (clock.status !== 200) {
            console.error("❌ DB Read Failed! Likely Mongo Atlas IP Whitelist issue.");
            return;
        }

        // 2. Trigger News Ingest (Does DB Write + Logic work?)
        console.log('\n2️⃣  Triggering /api/news/ingest (DB Write + Scraper)...');
        const news = await request('/api/news/ingest', { method: 'POST' });
        console.log(`Status: ${news.status}`);
        console.log(`Response: ${news.data}`);

        if (news.status === 200) {
            console.log("\n✅ SUCCESS: News ingestion triggered. Data should appear soon.");
        } else {
            console.log("\n❌ FAIL: Ingestion failed. Check Vercel Logs.");
        }

    } catch (error) {
        console.error("Critical Error:", error.message);
    }
}

runDebug();
