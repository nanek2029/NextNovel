const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    verificationCodeHash: {
        type: String,
        required: true
    },
    verificationCodeExpires: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

module.exports = PendingUser;
