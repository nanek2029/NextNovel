const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'reading', 'want to read', 'DNF'],
    },
    length: {
        type: Number
    }
});

const savedBookSchema = new mongoose.Schema({
    book: {
        type: bookSchema,
        required: true
    },
    dateAdded: {
        type: Date,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
});

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
        type: [savedBookSchema],
        default: []
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;