const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                const names = json.models
                    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                    .map(m => m.name);

                const fs = require('fs');
                fs.writeFileSync('valid_models.json', JSON.stringify(names, null, 2));
                console.log('Wrote valid_models.json');
            } else {
                console.error('No models found in response:', JSON.stringify(json));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (e) => {
    console.error("Network Error:", e);
});
