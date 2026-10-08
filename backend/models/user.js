const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    savedBooks: {
        type: [String],
        default: []
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;