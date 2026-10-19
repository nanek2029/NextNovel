/// Omar - NextNovel - Sprint 1
// Jira Task: PBI #3
// Authentication routes for register, login, and logout.

const express = require('express');
const router = express.Router();

const {
    register,
    login,
    logout
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;