const axios = require('axios');

async function debugLogs() {
    try {
        const response = await axios.get('https://doomsday-nine.vercel.app/api/logs?limit=10', {
            headers: {
                'x-admin-key': 'iammohammednihal_andiwanttocreate_worldchangintech34441'
            }
        });
        const aiError = response.data.logs.find(l => l.action === 'AI_EVALUATION_ERROR');
        if (aiError) {
            console.log('AI Error found!');
            console.log('Details:', JSON.stringify(aiError.details, null, 2));
        } else {
            console.log('No AI error found in the last 10 logs.');
            console.log('Actions found:', response.data.logs.map(l => l.action));
        }
    } catch (error) {
        console.error('Error fetching logs:', error.message);
    }
}

debugLogs();
