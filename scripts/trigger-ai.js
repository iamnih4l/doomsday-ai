require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const targetUrl = process.env.VERCEL_PROJECT_URL || 'http://localhost:3000';
console.log(`Triggering AI Evaluation at: ${targetUrl}`);

const url = new URL(targetUrl);
const isHttps = url.protocol === 'https:';
const client = isHttps ? require('https') : require('http');

const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: '/api/ai/evaluate',
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
            console.log('✅ AI Evaluation triggered successfully');
            process.exit(0);
        } else {
            console.error('❌ AI Evaluation failed');
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Problem with request: ${e.message}`);
    process.exit(1);
});

req.end();
