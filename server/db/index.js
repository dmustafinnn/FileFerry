const mongoose = require('mongoose');

// Mongoose Init
const getDB = require('../utils/getDB');

module.exports = async function connection() {
    const db_url = getDB();
    console.log(db_url);
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(db_url, connectionParams);
        console.log('Connected to MongoDB');
        console.log(`DB URL: ${db_url}`);
    } catch (error) {
        console.error('Connection error', error.message)
    }
};