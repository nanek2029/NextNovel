const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('_id username email role')
            .sort({ username: 1 })
            .lean();

        return res.status(200).json({
            users: users.map((user) => ({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }))
        });
    } catch (error) {
        console.error('Admin user list fetch failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while fetching users.'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID.'
            });
        }

        if (req.user._id.toString() === userId) {
            return res.status(403).json({
                message: 'You cannot delete your own account from the admin dashboard.'
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            message: 'User deleted successfully.'
        });
    } catch (error) {
        console.error('Admin user deletion failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while deleting user.'
        });
    }
};

module.exports = {
    getUsers,
    deleteUser
};
