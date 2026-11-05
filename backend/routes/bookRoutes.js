// Omar - NextNovel
// Jira Tasks: PBI #10, PBI #12, and PBI #14
// Defines backend routes for book searches, recommendations, and saved-book status updates.

const express = require('express');
const router = express.Router();

const {
    searchBooks,
    getQuestionnaireRecommendations,
    updateReadingStatus
} = require('../controllers/bookController');

// Search for books
// GET /api/books/search?q=bookTitle&type=title
router.get('/search', searchBooks);

// Get book recommendations from questionnaire responses
// POST /api/books/recommendations
router.post('/recommendations', getQuestionnaireRecommendations);

// Update the reading status of a saved book
// PATCH /api/books/saved/:bookId/status
router.patch('/saved/:bookId/status', updateReadingStatus);

module.exports = router;