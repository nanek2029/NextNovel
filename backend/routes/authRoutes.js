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
    getAccount
} = require('../controllers/authController');

router.post('/register', register);
router.post('/send-verification', sendVerificationCode);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete', deleteAccount);
router.get('/account', getAccount);


module.exports = router;