// Omar - NextNovel
// Jira Tasks: PBI #10, PBI #12, PBI #14, and PBI #18
// Handles book search, questionnaire recommendations,
// AI similar-book recommendations, and saved-book reading status updates.

const User = require('../models/user');

// Number of verified similar books returned to the frontend
const SIMILAR_BOOK_LIMIT = 6;

// Ask Gemini for extra suggestions since some may not verify in Google Books
const GEMINI_CANDIDATE_LIMIT = 15;

// Validate the book selected for similar-book recommendations
const validateSelectedBook = (book) => {
    if (!book || typeof book !== 'object' || Array.isArray(book)) {
        throw new Error('A selected book is required');
    }
    const title = typeof book.title === 'string' ? book.title.trim() : '';
    const author = typeof book.author === 'string' ? book.author.trim() : '';
    const genre = typeof book.genre === 'string' ? book.genre.trim() : '';
    const year = Number(book.year) || 0;
    if (!title) {
        throw new Error('The selected book must have a title')
    }

    return { title, author, genre, year };
};

// Ask Gemini for real book candidates similar to the selected book
const getGeminiBookCandidates = async (selectedBook) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
    }

    const prompt = `Recommend ${GEMINI_CANDIDATE_LIMIT} real, published books that are similar to this book:

Title: ${selectedBook.title}
Author: ${selectedBook.author || 'Unknown'}
Genre: ${selectedBook.genre || 'Unknown'}
Year: ${selectedBook.year || 'Unknown'}

Requirements:
- Recommend only real, published books.
- Do not recommend the selected book itself.
- Choose books that are similar in genre, themes, tone, setting, or audience.
- Return a short one-sentence explanation of why each recommendation is similar.
- Provide the correct title and author for every recommendation.
`;

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    let response;

    // Retry temporary Gemini 429/503 errors
    for (let attempt = 0; attempt < 4; attempt++) {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.3,
                    responseMimeType: 'application/json',
                    responseJsonSchema: {
                        type: 'object',
                        properties: {
                            books: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        title: {
                                            type: 'string'
                                        },
                                        author: {
                                            type: 'string'
                                        },
                                        reason: {
                                            type: 'string'
                                        }
                                    },
                                    required: [
                                        'title',
                                        'author',
                                        'reason'
                                    ]
                                }
                            }
                        },
                        required: ['books']
                    }
                }
            })
        });

        if (response.status !== 429 && response.status !== 503) {
            break;
        }

        if (attempt < 3) {
            await new Promise((resolve) =>
                setTimeout(resolve, 1000 * (attempt + 1))
            );
        }
    }

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            'Gemini API error:',
            response.status,
            errorText
        );

        throw new Error(
            `Gemini API request failed with status ${response.status}.`
        );
    }

    const data = await response.json();

    const responseText = data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || '')
        .join('');

    if (!responseText) {
        throw new Error('Gemini returned an empty response.');
    }

    let parsedResponse;

    try {
        parsedResponse = JSON.parse(responseText);
    } catch {
        throw new Error('Gemini returned invalid JSON.');
    }

    if (!Array.isArray(parsedResponse.books)) {
        throw new Error('Gemini response did not contain a book list.');
    }

    return parsedResponse.books
        .filter(book =>
            typeof book.title === 'string' &&
            book.title.trim() &&
            typeof book.author === 'string' &&
            book.author.trim() &&
            typeof book.reason === 'string' &&
            book.reason.trim()
        )
        .map(book => ({
            title: book.title.trim(),
            author: book.author.trim(),
            reason: book.reason.trim()
        }))
        .slice(0, GEMINI_CANDIDATE_LIMIT);
};

// Verify a Gemini recommendation using Google Books
const verifyBookWithGoogle = async (candidate) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    if (!apiKey) {
        throw new Error('Google Books API key is not configured.');
    }

    const searchQuery = `intitle:${candidate.title} inauthor:${candidate.author}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=5&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error(
            'Google Books verification error:',
            response.status,
            response.statusText
        );
        return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        return null;
    }

    const normalizedTitle = candidate.title.toLowerCase().trim();

    const normalizedAuthor = candidate.author.toLowerCase().trim();

    const matchingItem = data.items.find((item) => {
        const info = item.volumeInfo || {};

        const googleTitle = (info.title || '').toLowerCase().trim();

        const googleAuthors =
            (info.authors || [])
                .join(' ')
                .toLowerCase();

        return (googleTitle === normalizedTitle && googleAuthors.includes(normalizedAuthor));
    });

    if (!matchingItem) {
        return null;
    }

    const info = matchingItem.volumeInfo || {};

    return {
        id: matchingItem.id,
        title: info.title || candidate.title,
        author: info.authors?.join(', ') || candidate.author,
        genre: info.categories?.join(', ') || '',
        year: info.publishedDate
            ? Number(info.publishedDate.substring(0, 4))
            : 0,
        thumbnail: info.imageLinks?.thumbnail || '',
        length: info.pageCount || 0,
        reason: candidate.reason
    };
};

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
    return { operator: filter.operator, value };
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
        const { genres, pageCount, publicationYear } = req.body;

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

// Get AI-powered similar-book recommendations
const getSimilarBooks = async (req, res) => {
    try {
        let selectedBook;

        // Validate the book sent from the frontend
        try {
            selectedBook = validateSelectedBook(req.body?.book);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        // Ask Gemini for candidate recommendations
        const candidates = await getGeminiBookCandidates(selectedBook);

        const verifiedBooks = [];
        const seenBookIds = new Set();

        const selectedTitle = selectedBook.title.toLowerCase().trim();

        const selectedAuthor = selectedBook.author.toLowerCase().trim();

        // Verify Gemini's suggestions through Google Books
        for (const candidate of candidates) {
            // Stop once we have enough verified books
            if (verifiedBooks.length >= SIMILAR_BOOK_LIMIT) {
                break;
            }

            const verifiedBook = await verifyBookWithGoogle(candidate);

            // Ignore recommendations Google Books could not verify
            if (!verifiedBook) {
                continue;
            }

            const verifiedTitle = verifiedBook.title.toLowerCase().trim();

            const verifiedAuthor = verifiedBook.author.toLowerCase().trim();

            // Do not recommend the book the user already selected
            const isSelectedBook =
                verifiedTitle === selectedTitle &&
                (!selectedAuthor || verifiedAuthor.includes(selectedAuthor));

            if (isSelectedBook) {
                continue;
            }

            // Avoid returning duplicate Google Books volumes
            if (seenBookIds.has(verifiedBook.id)) {
                continue;
            }

            seenBookIds.add(verifiedBook.id);
            verifiedBooks.push(verifiedBook);
        }

        return res.status(200).json({
            books: verifiedBooks
        });

    } catch (error) {
        console.error(
            'Similar-book recommendation failed:', error.message
        );

        return res.status(502).json({
            message: 'Failed to generate similar-book recommendations.'
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
    getSimilarBooks,
    updateReadingStatus
};