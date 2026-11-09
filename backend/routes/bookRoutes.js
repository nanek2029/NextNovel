// Omar - NextNovel
// Jira Tasks: PBI #10, PBI #12, PBI #14, and PBI #18
// Defines backend routes for book searches, recommendations,
// AI similar-book recommendations, and saved-book status updates.

const express = require('express');
const router = express.Router();

const {
    searchBooks,
    getQuestionnaireRecommendations,
    getSimilarBooks,
    updateReadingStatus
} = require('../controllers/bookController');

// Search for books
// GET /api/books/search?q=bookTitle&type=title
router.get('/search', searchBooks);

// Get book recommendations from questionnaire responses
// POST /api/books/recommendations
router.post('/recommendations', getQuestionnaireRecommendations);

// Get AI-powered similar-book recommendations
// POST /api/books/similar
router.post('/similar', getSimilarBooks);

// Update the reading status of a saved book
// PATCH /api/books/saved/:bookId/status
router.patch('/saved/:bookId/status', updateReadingStatus);

module.exports = router;