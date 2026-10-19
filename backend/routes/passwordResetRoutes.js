// Omar - NextNovel - Sprint 1
// PBI #5
// Defines password recovery routes.

const express = require('express');
const router = express.Router();

const {
    requestPasswordReset, resetPassword
} = require('../controllers/passwordResetController');

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
