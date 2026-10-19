// Omar - NextNovel Sprint 1
// Jira Task: PBI #3 and PBI #5
// Initializes the NextNovel Express backend server.
// Configures JSON request handling, authentication routes,
// and connects the backend to MongoDB using Mongoose.

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');


// Creating the Express application
const app = express();

// Middleware to allow server to process JSON requests
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Define port (default 5000)
const PORT = process.env.PORT || 5000;

// Connect authentication routes to the backend server
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);

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