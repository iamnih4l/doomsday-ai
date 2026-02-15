require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('Testing connection to:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');

if (!uri) {
    console.error("ERROR: MONGODB_URI is not defined in .env");
    process.exit(1);
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("✅ Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection failed:", err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error("Hint: Is your local MongoDB server running?");
        }
        if (err.message.includes('bad auth')) {
            console.error("Hint: Check your username and password.");
        }
        process.exit(1);
    });
