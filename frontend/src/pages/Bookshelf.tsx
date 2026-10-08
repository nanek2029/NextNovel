import {
    Button,
    Flex,
    Group,
    SimpleGrid,
    Text,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import BookCard from '../secondary/BookCard';
import type { BookStatus } from '../secondary/BookCard';
import { dummyBookData } from '../secondary/dummyBookData';

// this is just a placeholder to show what the bookshelf version of the book card looks like

export default function Bookshelf() {
    const [books, setBooks] = useState(
        dummyBookData.map((book) => ({
            ...book,
            status: 'want to read' as BookStatus,
        }))
    );

    const [filter, setFilter] = useState<BookStatus | 'all'>('all');

    const filteredBooks =
        filter === 'all'
            ? books
            : books.filter((book) => book.status === filter);

    return (
        <Flex
            bg="#FFFFE6"
            justify="center"
            style={{
                width: '100%',
                height: 'calc(100vh - 56px)',
                overflowY: 'auto',
            }}
        >
            <Flex direction="column" style={{ width: '100%' }} p="md">
                <Title order={2} c="#3A5B22" mb="sm">
                    My Bookshelf
                </Title>

                <Group mb="md">
                    <Button
                        color="#3A5B22"
                        variant={filter === 'all' ? 'filled' : 'light'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>

                    <Button
                        color="#3A5B22"
                        variant={filter === 'want to read' ? 'filled' : 'light'}
                        onClick={() => setFilter('want to read')}
                    >
                        Want to Read
                    </Button>

                    <Button
                        color="#3A5B22"
                        variant={filter === 'reading' ? 'filled' : 'light'}
                        onClick={() => setFilter('reading')}
                    >
                        Reading
                    </Button>

                    <Button
                        color="#3A5B22"
                        variant={filter === 'read' ? 'filled' : 'light'}
                        onClick={() => setFilter('read')}
                    >
                        Read
                    </Button>

                    <Button
                        color="#3A5B22"
                        variant={filter === 'DNF' ? 'filled' : 'light'}
                        onClick={() => setFilter('DNF')}
                    >
                        DNF
                    </Button>
                </Group>

                {filteredBooks.length === 0 ? (
                    <Text c="#637A4E">No books in this category.</Text>
                ) : (
                    <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
                        {filteredBooks.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                mode="bookshelf"
                                status={book.status}
                                onStatusChange={(status) => {
                                    setBooks((previous) =>
                                        previous.map((item) =>
                                            item.id === book.id ? { ...item, status } : item
                                        )
                                    );
                                }}
                                onRemove={() => {
                                    setBooks((previous) =>
                                        previous.filter((item) => item.id !== book.id)
                                    );
                                }}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Flex>
        </Flex>
    );
}