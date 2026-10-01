import { Flex, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import BookCard from '../secondary/BookCard';
import type { BookStatus } from '../secondary/BookCard';
import { dummyBookData } from '../secondary/dummyBookData';

// this is just a placeholder to show what the bookshelf version of the book card looks like, feel free to change layout and size of book cards 


export default function Bookshelf() {

    const [books, setBooks] = useState(
        dummyBookData.map((book) => ({
            ...book,
            status: 'want to read' as BookStatus,
        }))
    );

    return (
        <Flex
            bg="#FFFEF6"
            justify="center"
            style={{
                width: '100%',
                height: 'calc(100vh - 56px)',
                overflowY: 'auto',
            }}
        >
            <SimpleGrid
              cols={2}
              spacing="md"
              verticalSpacing="xs"
              p="md"
            >
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        mode="bookshelf"
                        status={book.status}
                        onStatusChange={(status) => {
                            setBooks((previous) =>
                                previous.map((item) =>
                                    item.id === book.id
                                        ? { ...item, status }
                                        : item
                                )
                            );
                        }}
                        onRemove={() => {
                            setBooks((previous) =>
                                previous.filter(
                                    (item) => item.id !== book.id
                                )
                            );
                        }}
                    />
                ))}
            </SimpleGrid>
        </Flex>
    );
}