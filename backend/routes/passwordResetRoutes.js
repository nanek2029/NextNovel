// Omar - NextNovel - Sprint 1
// PBI #5
// Defines password recovery routes.

const express = require('express');
const router = express.Router();

const {
    requestPasswordReset, resetPassword, changePassword
} = require('../controllers/passwordResetController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', requireAuth, changePassword);

module.exports = router;
