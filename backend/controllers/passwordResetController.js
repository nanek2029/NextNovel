// Omar - NextNovel - Sprint 1
// PBI #5
// Handles password reset token generation and password recovery logic.

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendPasswordResetEmail } = require('../services/emailService');


// Request a password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required.'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        // Avoid revealing whether an email exists in the database
        if (!user) {
            return res.status(200).json({
                message: 'If an account exists for that email, a password reset email has been sent.'
            });
        }

        // Generate secure random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store only the hashed version in MongoDB
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Token expires in 15 minutes
        user.resetPasswordTokenHash = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        // Send the raw reset token to the user's email
        await sendPasswordResetEmail(user.email, resetToken);

        return res.status(200).json({
            message: 'If an account exists for that email, a password reset email has been sent.'
        });

    } catch (error) {
        console.error('Password reset request failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while requesting password reset.'
        });
    }
};

// Reset the user's password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Reset token and new password are required.'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long.'
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordTokenHash: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Reset token is invalid or has expired.'
            });
        }

        // Hash and save the new password
        user.passwordHash = await bcrypt.hash(newPassword, 10);

        // Clear reset information so the token cannot be reused
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            message: 'Password updated successfully.'
        });

    } catch (error) {
        console.error('Password reset failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while resetting password.'
        });
    }
};

module.exports = {
    requestPasswordReset,
    resetPassword
};