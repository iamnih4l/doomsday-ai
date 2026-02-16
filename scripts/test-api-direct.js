const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log(`Querying: ${url.replace(key, 'HIDDEN_KEY')}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', JSON.stringify(json.error, null, 2));
            } else {
                if (json.models) {
                    console.log('--- VALID MODELS START ---');
                    json.models.forEach(m => {
                        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                            console.log(m.name.replace('models/', '')); // Print both with and without prefix just in case? No, just base name usually.
                            // actually, print the full name as appearing in the API
                            console.log(m.name);
                        }
                    });
                    console.log('--- VALID MODELS END ---');
                } else {
                    console.log('No models found');
                }
            }
        } catch (e) {
            console.log('Raw Response:', data);
        }
    });
}).on('error', (e) => {
    console.error("Network Error:", e);
});
