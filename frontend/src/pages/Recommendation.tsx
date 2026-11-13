import {
    Autocomplete,
    Button,
    Flex,
    SimpleGrid,
    Text,
    Title
} from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import BookCard, { type Book } from '../secondary/BookCard';

export default function Recommendation() {
    const [search, setSearch] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
    const [message, setMessage] = useState('');

    // Search Google Books
    const fetchBooks = async () => {
        if (!search.trim()) {
            return;
        }

        try {
            const response = await fetch(
                `/api/books/search?q=${encodeURIComponent(search)}&type=title`
            );

            const data = await response.json();

            if (response.ok) {
                setBooks((data.books || []).slice(0, 8));
            }
        } catch (error) {
            console.error('Book search failed:', error);
        }
    };

    // Send selected book to similar-book backend endpoint
    const findSimilarBooks = async () => {
        if (!selectedBook) {
            return;
        }

        try {
            const response = await fetch('/api/books/similar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    book: selectedBook
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSimilarBooks(data.books || []);
                setMessage(`${data.books?.length || 0} similar books found.`);
            } else {
                setMessage(data.message || 'Unable to find similar books.');
            }
        } catch (error) {
            console.error('Similar book request failed:', error);
            setMessage('Unable to find similar books.');
        }
    };

    return (
        <Flex
            bg="#FFFEF6"
            direction="column"
            align="center"
            style={{
                width: '100%',
                minHeight: 'calc(100vh - 56px)',
                padding: '2rem'
            }}
        >
            <Title c="#3A5B22" order={1} mb="sm">
                Find Similar Books
            </Title>

            <Text c="#637a4e" mb="lg">
                Search for a book you like and select it below.
            </Text>

            <Flex gap="sm" w="75%">
                <Autocomplete
                    value={search}
                    onChange={setSearch}
                    placeholder="Search for a book..."
                    data={[]}
                    leftSection={
                        <MagnifyingGlassIcon
                            color="#80AA62"
                            size={20}
                            weight="bold"
                        />
                    }
                    style={{ flex: 1 }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            void fetchBooks();
                        }
                    }}
                />
                <Button color="#3A5B22" onClick={fetchBooks}>
                    Search
                </Button>
            </Flex>

            {selectedBook && (
                <Flex
                    mt="xl"
                    p="md"
                    w="75%"
                    direction="column"
                    style={{
                        border: '1px solid #80AA62',
                        borderRadius: '12px'
                    }}
                >
                    <Text fw={500} c="#3A5B22">
                        Selected Book
                    </Text>
                    <Text>
                        {selectedBook.title} by {selectedBook.author}
                    </Text>

                    <Button
                        color="#3A5B22"
                        mt="sm"
                        onClick={() => void findSimilarBooks()}
                    >
                        Find Similar Books
                    </Button>

                    {message && (
                        <Text mt="sm" c="#637a4e">
                            {message}
                        </Text>
                    )}
                </Flex>
            )}

            {books.length > 0 && (
                <SimpleGrid
                    cols={2}
                    spacing="md"
                    w="75%"
                    mt="xl"
                >
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            mode="similar"
                            onSelect={() => {
                                setSelectedBook(book);
                                setMessage('');
                            }}
                        />
                    ))}
                </SimpleGrid>
            )}
            {similarBooks.length > 0 && (
                <Flex
                    direction="column"
                    w="75%"
                    mt="xl"
                >
                    <Title c="#3A5B22" order={2} mb="md">
                        Similar Books
                    </Title>
                    <SimpleGrid cols={2} spacing="md">
                        {similarBooks.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                mode="recommendation"
                            />
                        ))}
                    </SimpleGrid>
                </Flex>
            )}
        </Flex>
    );
}