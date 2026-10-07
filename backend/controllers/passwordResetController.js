// Omar - NextNovel - Sprint 1
// PBI #5
// Handles password reset token generation and recovery logic.

const crypto = require('crypto');

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const resetTokenExpires = Date.now() + 15 * 60 * 1000;

        // User database integration will be added once User.js is available.
        return res.status(200).json({
            message: 'Password reset token generated successfully.',
            resetToken,
            hashedToken,
            resetTokenExpires
        });

    } catch (error) {
        console.error('Password reset request failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while requesting password reset.'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Reset token and new password are required.'
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Database lookup and password update will be added
        // once Brady's User model is available.

        return res.status(501).json({
            message: 'Password reset validation passed. Database integration pending.',
            hashedToken
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