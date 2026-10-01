// Omar - NextNovel Sprint 1
// Jira Task: PBI #3
// Initializing the NextNovel Express backend server.
// Configures JSON request handling and test endpoint to ensure server is running.
// This server will support the account functionality endpoints for user registration, login, and logout.

const express = require('express');
// Creating the Express application
const app = express();

// Middleware to allow server to process JSON requests
app.use(express.json());
const PORT = process.env.PORT || 5000; // Define port (default 5000)

// Import authentication for PBI #3
const authRoutes = require('./routes/authRoutes');

// Connect authentication routes to the backend server
app.use('/api/auth', authRoutes);

// Test route to verify backend is running
app.get('/', (req, res) => {
    res.send('NextNovel API is running!');
    });

// Start the Express server
app.listen(PORT, () => {
    console.log(`NextNovel server running on http://localhost:${PORT}`);
});