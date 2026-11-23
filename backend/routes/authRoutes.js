/// Omar - NextNovel - Sprint 1
// Jira Task: PBI #3
// Authentication routes for register, login, and logout.

const express = require('express');
const router = express.Router();

const {
    register,
    sendVerificationCode,
    verifyEmail,
    login,
    logout,
    deleteAccount,
    getAccount,
    refresh,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/send-verification', sendVerificationCode);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.delete('/delete', requireAuth, deleteAccount);
router.get('/account', requireAuth, getAccount);


module.exports = router;