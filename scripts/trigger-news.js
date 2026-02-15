const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/news/ingest',
    method: 'POST',
    headers: {
        'x-admin-key': process.env.ADMIN_API_KEY || 'change_me_to_secure_random_string' // Fallback for test
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
