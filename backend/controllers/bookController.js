// Omar - NextNovel
// Jira Tasks: PBI #10, PBI #12, and PBI #14
// Handles book search, questionnaire recommendations, and saved-book reading status updates.

const User = require('../models/user');

// Genres currently supported by the questionnaire
const QUESTIONNAIRE_GENRES =
    ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller'];

// Validate optional page-count and publication-year filters
const parseQuestionnaireFilter = (filter, fieldName) => {
    // An empty filter means the user did not select a limit
    if (filter === undefined || filter === null) {
        return null;
    }
    if (typeof filter !== 'object' || Array.isArray(filter)) {
        throw new Error(`${fieldName} must be an object.`);
    }
    if (filter.value === '' || filter.value === null || filter.value === undefined) {
        return null;
    }
    // Only greater than and less than are supported
    if (!['>', '<'].includes(filter.operator)) {
        throw new Error(`${fieldName} must use > or <.`);
    }
    const value = Number(filter.value);
    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error(`${fieldName} must be a positive whole number.`);
    }
    // Publication years must be valid years
    if (fieldName === 'publicationYear' && (value < 1000 || value > new Date().getFullYear())) {
        throw new Error('Invalid publication year.');
    }
    return {operator: filter.operator, value};
};

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
                author: info.authors?.join(', ') || '',
                genre: info.categories?.join(', ') || '',
                year: info.publishedDate
                    ? Number(info.publishedDate.substring(0, 4))
                    : 0,
                thumbnail: info.imageLinks?.thumbnail || '',
                length: info.pageCount || 0,
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

// Get book recommendations from questionnaire responses
const getQuestionnaireRecommendations = async (req, res) => {
    try {
        const { genres, pageCount, publicationYear} = req.body;

        // At least one genre is needed to search Google Books
        if (!Array.isArray(genres) || genres.length === 0) {
            return res.status(400).json({
                message: 'Select at least one genre.'
            });
        }

        // Make sure every submitted genre is supported
        const invalidGenres = genres.filter(
            genre => !QUESTIONNAIRE_GENRES.includes(genre)
        );

        if (invalidGenres.length > 0) {
            return res.status(400).json({
                message: 'One or more selected genres are invalid.'
            });
        }

        let parsedPageCount;
        let parsedPublicationYear;

        // Validate the optional numeric filters
        try {
            parsedPageCount = parseQuestionnaireFilter(pageCount, 'pageCount');

            parsedPublicationYear = parseQuestionnaireFilter(publicationYear, 'publicationYear');
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const allBooks = [];

        // Search each selected genre separately
        for (const genre of genres) {
            const searchQuery = `subject:${genre}`;

            const url =
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=40&key=${apiKey}`;

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
                    'Google Books API error:', response.status, response.statusText);

                return res.status(502).json({
                    message: 'Failed to retrieve recommendations from Google Books.',
                    status: response.status
                });
            }

            const data = await response.json();

            // Convert Google Books results into NextNovel's book format
            const books = (data.items || []).map((item) => {
                const info = item.volumeInfo || {};

                return {
                    id: item.id,
                    title: info.title || 'Unknown title',
                    author: info.authors?.join(', ') || '',
                    genre: info.categories?.join(', ') || '',
                    year: info.publishedDate
                        ? Number(info.publishedDate.substring(0, 4))
                        : 0,
                    thumbnail: info.imageLinks?.thumbnail || '',
                    length: info.pageCount || 0,
                };
            });

            allBooks.push(...books);
        }

        // Remove duplicate books returned by multiple genre searches
        const uniqueBooks = Array.from(
            new Map(allBooks.map(book => [book.id, book])).values()
        );

        // Apply the questionnaire's page-count and year preferences
        const filteredBooks = uniqueBooks.filter((book) => {
            if (parsedPageCount) {
                if (book.length === 0) {
                    return false;
                }

                if (parsedPageCount.operator === '>' && book.length <= parsedPageCount.value) {
                    return false;
                }

                if (parsedPageCount.operator === '<' && book.length >= parsedPageCount.value) {
                    return false;
                }
            }

            if (parsedPublicationYear) {
                if (book.year === 0) {
                    return false;
                }

                if (parsedPublicationYear.operator === '>' && book.year <= parsedPublicationYear.value) {
                    return false;
                }

                if (parsedPublicationYear.operator === '<' && book.year >= parsedPublicationYear.value) {
                    return false;
                }
            }
            return true;
        });

        return res.status(200).json({
            books: filteredBooks
        });

    } catch (error) {
        console.error('Questionnaire recommendation failed:', error.message);

        return res.status(500).json({
            message: 'Internal server error while generating recommendations.'
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
    getQuestionnaireRecommendations,
    updateReadingStatus
};