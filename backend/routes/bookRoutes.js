// Omar - NextNovel
// Jira Tasks: PBI #10 and PBI #12
// Defines backend routes for book searches and saved-book status updates.

const express = require('express');
const router = express.Router();

const {
    searchBooks,
    updateReadingStatus
} = require('../controllers/bookController');

// Search for books
// GET /api/books/search?q=bookTitle&type=title
router.get('/search', searchBooks);

// Update the reading status of a saved book
// PATCH /api/books/saved/:bookId/status
router.patch('/saved/:bookId/status', updateReadingStatus);

module.exports = router;