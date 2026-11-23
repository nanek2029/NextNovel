const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const { getAccessSecret, getIssuer } = require('../utils/authTokens');

const requireAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        const token = authorization.slice('Bearer '.length);
        let payload;

        try {
            payload = jwt.verify(token, getAccessSecret(), {
                issuer: getIssuer(),
                audience: 'nextnovel-client'
            });
        } catch {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        if (payload.typ !== 'access' || !mongoose.isValidObjectId(payload.sub)) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        const user = await User.findById(payload.sub).select('-passwordHash');
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        req.user = user;
        req.auth = {
            userId: user._id.toString(),
            username: user.username,
            role: user.role
        };
        return next();
    } catch (error) {
        console.error('Authentication failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error while checking authentication.'
        });
    }
};

const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden. Admin access required.'
            });
        }
        return next();
    } catch (error) {
        console.error('Admin authorization failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while checking authorization.'
        });
    }
};

module.exports = {
    requireAuth,
    requireAdmin
};
