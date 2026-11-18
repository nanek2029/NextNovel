// Omar - NextNovel - Sprint 1
// Jira Task: PBI #3
// Handles user registration, login, and logout.

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user');
const PendingUser = require('../models/pendingUser');
const { sendVerificationEmail } = require('../services/emailService');

const VERIFICATION_CODE_LIFETIME_MS = 15 * 60 * 1000;

const createVerificationCode = () => {
    const code = crypto.randomInt(100000, 1000000).toString();
    return {
        code,
        hash: crypto.createHash('sha256').update(code).digest('hex'),
        expires: new Date(Date.now() + VERIFICATION_CODE_LIFETIME_MS)
    };
};

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Username, email, and password are required.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        // Make sure username or email is not already being used
        const [existingUser, pendingUser] = await Promise.all([
            User.findOne({
                $or: [
                    { email: normalizedEmail },
                    { username: normalizedUsername }
                ]
            }),
            PendingUser.findOne({
                $or: [
                    { email: normalizedEmail },
                    { username: normalizedUsername }
                ]
            })
        ]);

        if (existingUser || pendingUser) {
            return res.status(409).json({
                message: 'Username or email is already in use, or awaiting verification.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const verification = createVerificationCode();

        await PendingUser.create({
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash,
            verificationCodeHash: verification.hash,
            verificationCodeExpires: verification.expires
        });

        try {
            await sendVerificationEmail(normalizedEmail, verification.code);
        } catch (error) {
            console.error('Verification email failed:', error.message);
            return res.status(500).json({
                message: 'Unable to send verification email. Please try again.'
            });
        }

        return res.status(201).json({
            message: 'Verification email sent. Please verify your email to finish creating your account.',
            email: normalizedEmail
        });
    } catch (error) {
        console.error('Registration failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while creating account.'
        });
    }
};

const sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const pendingUser = await PendingUser.findOne({ email: normalizedEmail });

        if (!pendingUser) {
            return res.status(404).json({
                message: 'No pending registration was found for that email.'
            });
        }

        const verification = createVerificationCode();
        pendingUser.verificationCodeHash = verification.hash;
        pendingUser.verificationCodeExpires = verification.expires;
        await pendingUser.save();

        await sendVerificationEmail(normalizedEmail, verification.code);

        return res.status(200).json({
            message: 'A new verification code has been sent.'
        });
    } catch (error) {
        console.error('Verification email resend failed:', error.message);

        return res.status(500).json({
            message: 'Unable to send verification email.'
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: 'Email and verification code are required.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedCode = code.trim();

        if (!/^\d{6}$/.test(normalizedCode)) {
            return res.status(400).json({
                message: 'Verification code must be six digits.'
            });
        }

        const codeHash = crypto
            .createHash('sha256')
            .update(normalizedCode)
            .digest('hex');

        const pendingUser = await PendingUser.findOne({
            email: normalizedEmail,
            verificationCodeHash: codeHash,
            verificationCodeExpires: { $gt: new Date() }
        });

        if (!pendingUser) {
            return res.status(400).json({
                message: 'Verification code is invalid or has expired.'
            });
        }

        const user = await User.create({
            username: pendingUser.username,
            email: pendingUser.email,
            passwordHash: pendingUser.passwordHash
        });

        await PendingUser.deleteOne({ _id: pendingUser._id });

        return res.status(201).json({
            message: 'Email verified and account created successfully.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Email verification failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while verifying email.'
        });
    }
};

// Log in an existing user
const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                message: 'Username or email and password are required.'
            });
        }

        let user;

        if (email) {
            user = await User.findOne({
                email: email.trim().toLowerCase()
            });
        } else {
            user = await User.findOne({
                username: username.trim()
            });
        }

        if (!user) {
            return res.status(401).json({
                message: 'Invalid username/email or password.'
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid username/email or password.'
            });
        }

        // Store authenticated user information in the session
        req.session.userId = user._id.toString();
        req.session.username = user.username;

        return res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while logging in.'
        });
    }
};

// Log out the current user
const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout failed:', error.message);

            return res.status(500).json({
                message: 'Unable to log out.'
            });
        }

        res.clearCookie('connect.sid');

        return res.status(200).json({
            message: 'Logout successful.'
        });
    });
};

// deleting current user acc
const deleteAccount = async (req, res) => {
    // make sure the user is authenticated before allowing account deletion
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        //delete  from MongoDB
        const deletedUser = await User.findByIdAndDelete(req.session.userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        // end the session and clear cookie
        req.session.destroy((error) => {
            if (error) {
                console.error('Session destruction failed:', error.message);
                return res.status(500).json({
                    message: 'Account deleted, but unable to clear session.'
                });
            }

            res.clearCookie('connect.sid');
            return res.status(200).json({
                message: 'Account deleted successfully.'
            });
        });

    } catch (error) {
        console.error('Account deletion failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error while deleting account.'
        });
    }
};

// retrieve user profile data
const getAccount = async (req, res) => {

    // must be logged in
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        //retrieve data but not password
        const user = await User.findById(req.session.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Failed to fetch user profile:', error.message);
        return res.status(500).json({
            message: 'Internal server error while fetching user profile.'
        });
    }
};

module.exports = {
    register,
    sendVerificationCode,
    verifyEmail,
    login,
    logout,
    deleteAccount,
    getAccount
};