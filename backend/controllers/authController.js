// Omar - NextNovel - Sprint 1
// Jira Task: PBI #3
// Handles user registration, login, and logout.

const bcrypt = require('bcrypt');
const User = require('../models/user');

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
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username or email is already in use.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash
        });

        return res.status(201).json({
            message: 'Account created successfully.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while creating account.'
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
                email: user.email
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

module.exports = {
    register,
    login,
    logout
};