const mongoose = require('mongoose');
const logger = require("../AppLog/logger")

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URI);
        logger.info("DB Connected")
    }
    catch (error) {
        logger.error(`DB connect failed: ${error}`)
        process.exit(1);
    }  
}

module.exports = { connectDB };