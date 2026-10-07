// Omar - NextNovel - Sprint 1
// Jira Task: PBI #10
// Defines backend routes for searching books.

const express = require('express');
const router = express.Router();

const { searchBooks } = require('../controllers/bookController');

// GET /API/books/search?q=bookTitle
router.get('/search', searchBooks);
module.exports = router;