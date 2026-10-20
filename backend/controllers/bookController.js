// Omar - NextNovel
// Jira Tasks: PBI #10 and PBI #12
// Handles book search and saved-book reading status updates.

const User = require('../models/user');

// Search books through Google Books API
const searchBooks = async (req, res) => {
    try {
        const { q, type } = req.query;

        // Require a search query
        if (!q || !q.trim()) {
            return res.status(400).json({
                error: 'A book search query is required.'
            });
        }

        let searchQuery = q.trim();

        // Format query based on selected search type
        if (type === 'title') {
            searchQuery = `intitle:${searchQuery}`;
        } else if (type === 'author') {
            searchQuery = `inauthor:${searchQuery}`;
        } else if (type === 'genre') {
            searchQuery = `subject:${searchQuery}`;
        }

        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

        const url =
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

        let response;

        // Retry temporary Google Books 503 errors
        for (let attempt = 0; attempt < 3; attempt++) {
            response = await fetch(url);

            if (response.status !== 503) {
                break;
            }

            await new Promise(resolve =>
                setTimeout(resolve, 1000 * (attempt + 1))
            );
        }

        if (!response.ok) {
            console.error(
                'Google Books API error:',
                response.status,
                response.statusText
            );

            return res.status(502).json({
                message: 'Failed to retrieve books from Google Books.',
                status: response.status
            });
        }

        const data = await response.json();

        const books = (data.items || []).map((item) => {
            const info = item.volumeInfo || {};

            return {
                id: item.id,
                title: info.title || 'Unknown title',
                authors: info.authors || [],
                description: info.description || '',
                thumbnail: info.imageLinks?.thumbnail || '',
                pageCount: info.pageCount || null,
                categories: info.categories || []
            };
        });

        return res.status(200).json({
            books
        });

    } catch (error) {
        console.error('Book search failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while searching for books.'
        });
    }
};

// Update the reading status of a saved book
const updateReadingStatus = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { status } = req.body;

        // User must be logged in
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                message: 'You must be logged in to update a book.'
            });
        }

        const validStatuses = [
            'read',
            'reading',
            'want to read',
            'DNF'
        ];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid reading status.'
            });
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        const savedBook = user.savedBooks.find(
            (item) => item.book && item.book.id === bookId
        );

        if (!savedBook) {
            return res.status(404).json({
                message: 'Saved book not found.'
            });
        }

        savedBook.book.status = status;

        await user.save();

        return res.status(200).json({
            message: 'Reading status updated successfully.',
            savedBook
        });

    } catch (error) {
        console.error('Reading status update failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while updating reading status.'
        });
    }
};

module.exports = {
    searchBooks,
    updateReadingStatus
};