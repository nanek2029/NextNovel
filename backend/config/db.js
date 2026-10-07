// Omar - NextNovel - Sprint 1
// Jira Task: KAN-8 (PBI #3)
// Connects the NextNovel backend to MongoDB using Mongoose.

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
