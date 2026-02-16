const fs = require('fs');
try {
    const content = fs.readFileSync('models_list.txt', 'utf8');
    // The file might contain some non-JSON text at the start if console.log was used for debugging
    // But test-api-direct.js output: 
    // Querying: ...
    // Status: 200
    // Available Models: [ 'models/chat-bison-001', ... ]
    console.log('--- Content Start ---');
    console.log(content);
    console.log('--- Content End ---');
} catch (e) {
    console.error(e);
}
