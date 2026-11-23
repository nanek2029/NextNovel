// Omar - NextNovel Sprint 1
// Jira Tasks: PBI #3, PBI #5, and PBI #10
// Initializes the NextNovel Express backend server.
// Configures JSON request handling, authentication routes,
// and connects the backend to MongoDB using Mongoose.

require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Creating the Express application
const app = express();

// Middleware to allow server to process JSON requests
app.use(express.json());
app.use(cookieParser());

// Define port (default 5000)
const PORT = process.env.PORT || 5000;

// Connect authentication routes to the backend server
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
// Test route to verify backend is running
app.get('/', (req, res) => {
    res.send('NextNovel API is running!');
});

// Connect to MongoDB first, then start the Express server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`NextNovel server running on http://localhost:${PORT}`);
    });
});