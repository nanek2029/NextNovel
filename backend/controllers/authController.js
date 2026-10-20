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
                email: user.email
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
    login,
    logout,
    deleteAccount,
    getAccount
};