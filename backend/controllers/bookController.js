// Omar - NextNovel - Sprint 1
// Jira Task: PBI #10
// Handles backend book searches using the Google Books API.

// Search books through Google Books API
const searchBooks = async (req, res) => {
    try {
        const { q, type } = req.query;
        // require a search query
        if (!q || !q.trim()) {
            return res.status(400).json({
                error: 'A book search query is required.',
            });
        }
        let searchQuery = q.trim();

        if (type === 'title') {
            searchQuery = `intitle:${searchQuery}`;
        } else if (type === 'author') {
            searchQuery = `inauthor:${searchQuery}`;
        } else if (type === 'genre') {
            searchQuery = `subject:${searchQuery}`;
        }

        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

        const url = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`
        );
        let response;

        for (let attempt = 0; attempt < 3; attempt++) {
            response = await fetch(url);

            if (response.status !== 503) {
                break;
            }

            // Wait before retrying a temporary Google Books outage
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
                id: item.id, title: info.title || 'Unknown title',
                authors: info.authors || [], description: info.description || '',
                thumbnail: info.imageLinks?.thumbnail || '', pageCount: info.pageCount || null,
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

module.exports = {
    searchBooks,
};