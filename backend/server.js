require('dotenv').config();

// Omar - NextNovel Sprint 1
// Jira Task: PBI #3 and PBI #10
// Initializes the NextNovel Express backend server.
// Configures JSON request handling, authentication routes,
// and book search routes.

const express = require('express');

// Creating the Express application
const app = express();

// Middleware to allow server to process JSON requests
app.use(express.json());

// Define port (default 5000)
const PORT = process.env.PORT || 5000;

// Existing authentication routes
const authRoutes = require('./routes/authRoutes');

// Import book search routes for PBI #10
const bookRoutes = require('./routes/bookRoutes');

// Existing authentication endpoint
app.use('/api/auth', authRoutes);

// Connect book search routes to the backend server
app.use('/api/books', bookRoutes);

// Test route to verify backend is running
app.get('/', (req, res) => {
    res.send('NextNovel API is running!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`NextNovel server running on http://localhost:${PORT}`);
});