const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing Gemini Key:', key ? 'Present' : 'Missing');

    if (!key) {
        console.error('Error: GEMINI_API_KEY is missing');
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(key);
    const { HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

    const candidateModels = [
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    console.log('Starting iterative model test (extended)...');

    for (const modelName of candidateModels) {
        console.log(`\n--- Testing Model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                ]
            });

            console.log('Sending simple prompt...');
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            const text = response.text();
            console.log(`SUCCESS! Model ${modelName} works.`);
            console.log('Response:', text);

            const fs = require('fs');
            fs.writeFileSync('valid_model.txt', modelName);
            console.log(`Valid model saved to valid_model.txt: ${modelName}`);
            return;
        } catch (error) {
            console.error(`FAILED: Model ${modelName}`);
            if (error.message.includes('404')) console.error('Error: 404 Not Found');
            else if (error.message.includes('403')) console.error('Error: 403 Permission Denied');
            else console.error(`Error: ${error.message.substring(0, 150)}...`);
        }
    }
    console.error('\nAll extended candidate models failed.');
}

testGemini();
