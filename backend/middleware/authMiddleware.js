const mongoose = require('mongoose');
const User = require('../models/user');

const requireAdmin = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        if (!mongoose.isValidObjectId(req.session.userId)) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        const user = await User.findById(req.session.userId)
            .select('_id username email role');

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden. Admin access required.'
            });
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error('Admin authorization failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while checking authorization.'
        });
    }
};

module.exports = {
    requireAdmin
};
