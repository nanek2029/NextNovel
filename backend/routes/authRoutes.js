// Omar - NextNovel - Sprint 1
// Jira Task: PBI #3
// Defines the backend authentication routes for
// user registration, login, logout.
// Temporary responses are used to verify that API routes work before connecting MongoDB.

const express = require('express');
const router = express.Router();

// Import registration controller
const { register } = require('../controllers/authController');

// POST / API / auth / register
router.post('/register', register);


// POST / API / auth / login
router.post('/login', (req, res) => {
    res.status(501).json({
        message: 'Login not implemented yet.'
    });
});

// POST / API / auth / logout
router.post('/logout', (req, res) => {
    res.status(501).json({
        message: 'Logout not implemented yet.'
    });
});

module.exports = router;