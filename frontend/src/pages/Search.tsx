import { Flex, Autocomplete, rem, ActionIcon, Menu, Divider, Text, SimpleGrid, Button, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XIcon } from '@phosphor-icons/react';
import BookCard from '../secondary/BookCard';

type SearchHistoryItem = {
    search: string;
    searchType: string;
};

export default function Search() {
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [historyOpened, setHistoryOpened] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // close history window if clicking outside 
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (!target.closest('.search-container')) {
                setHistoryOpened(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // search books endpoint 
    const fetchBooks = async (query: string, type: string) => {
        if (!query.trim() || type.startsWith('length')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}&type=${type}`);
            const data = await response.json();
            if (response.ok) {
                setBooks(data.books || []);
            } else {
                setBooks([]);
            }
        } catch (error) {
            console.error('Book search failed:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // sort ascending or descending 
    const matchingBooks = (() => {
        if (searchType === 'length-asc') {
            return [...books].sort((a, b) => (a.pageCount || 0) - (b.pageCount || 0));
        }
        if (searchType === 'length-desc') {
            return [...books].sort((a, b) => (b.pageCount || 0) - (a.pageCount || 0));
        }
        return books;
    })();

    // add search to history and trigger backend fetch
    const addToHistory = () => {
        if (search.length === 0 && !searchType.startsWith('length')) {
            return;
        }

        if (!searchType.startsWith('length')) {
            fetchBooks(search, searchType);
        }

        setSearchHistory((previous) => {
            const updatedHistory = [
                { search, searchType },
                ...previous.filter(
                    (item) =>
                        item.search !== search ||
                        item.searchType !== searchType
                ),
            ];

            return updatedHistory.slice(0, 5);
        });

        setHistoryOpened(false);
    };

    const placeholder =
        searchType === 'title'
            ? 'Search a book title...'
            : searchType === 'author'
                ? 'Search by author...'
                : searchType === 'genre'
                    ? 'Search by genre...'
                    : searchType === 'length-asc'
                        ? 'Sorted by length (shortest first)'
                        : 'Sorted by length (longest first)';

    const getHistoryLabel = (item: SearchHistoryItem) => {
        if (item.searchType === 'length-asc') return 'Length (shortest first)';
        if (item.searchType === 'length-desc') return 'Length (longest first)';
        return item.search;
    };

    return (
        <Flex bg="#FFFEF6" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
            <Flex justify="flex-start" align="center" direction="column" mt="md" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>

                {/* Search section */}
                <div className="search-container" style={{ position: 'relative', width: 'calc(100vw - 400px)', flexShrink: 0 }}>
                    <Autocomplete
                        value={search}
                        onChange={setSearch}
                        onFocus={() => {
                            if (searchHistory.length > 0) {
                                setHistoryOpened(true);
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addToHistory();
                            }
                        }}
                        label="Search for a book"
                        placeholder={placeholder}
                        data={[]}
                        leftSection={<MagnifyingGlassIcon color="#80AA62" size={20} weight="bold" />}
                        rightSection={
                            <Flex align="center" gap={4}>
                                {search.length > 0 && (
                                    <ActionIcon variant="subtle" color="#3A5B22" radius="xl" size="sm" onClick={() => { setSearch(''); setBooks([]); }}>
                                        <XIcon size={16} weight="bold" />
                                    </ActionIcon>
                                )}

                                <Menu
                                    width={180}
                                    position="bottom-end"
                                    shadow={undefined}
                                    styles={{
                                        dropdown: {
                                            border: '1px solid #80AA62',
                                            borderRadius: '12px',
                                            backgroundColor: '#FFFFFF',
                                            padding: '6px',
                                        },
                                        label: { color: '#3A5B22', fontSize: 'var(--mantine-font-size-sm)', fontWeight: 500 },
                                        item: { color: '#3A5B22', fontSize: 'var(--mantine-font-size-sm)', borderRadius: '8px' },
                                        itemLabel: { color: '#3A5B22' },
                                    }}
                                >
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="#3A5B22" radius="xl" size="sm">
                                            <FunnelIcon size={18} weight="bold" />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>Search by</Menu.Label>
                                        <Menu.Item onClick={() => { setSearchType('title'); }}>Title</Menu.Item>
                                        <Menu.Item onClick={() => { setSearchType('author'); }}>Author</Menu.Item>
                                        <Menu.Item onClick={() => { setSearchType('genre'); }}>Genre</Menu.Item>
                                        <Menu.Item onClick={() => { setSearchType('length-asc'); }}>Length (shortest first)</Menu.Item>
                                        <Menu.Item onClick={() => { setSearchType('length-desc'); }}>Length (longest first)</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Flex>
                        }
                        rightSectionWidth={75}
                        mt="xl"
                        radius={historyOpened ? '12px 12px 0 0' : 'xl'}
                        w="100%"
                    />

                    {historyOpened && searchHistory.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #80AA62',
                                borderTop: 'none',
                                borderRadius: '0 0 12px 12px',
                                padding: '10px 14px 12px 14px',
                                zIndex: 100,
                                boxShadow: '0 6px 12px rgba(58, 91, 34, 0.18)',
                            }}
                        >
                            <Flex justify="space-between" align="center">
                                <Text size="sm" fw={500} c="#3A5B22">Recent searches</Text>
                                <Button variant="subtle" color="#3A5B22" size="compact-sm"
                                    onClick={() => { setSearchHistory([]); setHistoryOpened(false); }}
                                >
                                    Clear history
                                </Button>
                            </Flex>

                            <Divider color="#80AA62" my="xs" />

                            <Flex direction="column" gap={4}>
                                {searchHistory.map((item, index) => (
                                    <Text
                                        key={`${item.searchType}-${item.search}-${index}`}
                                        size="sm"
                                        c="#637A4E"
                                        style={{ cursor: 'pointer', padding: '4px 6px', borderRadius: '6px' }}
                                        onClick={() => {
                                            setSearchType(item.searchType);
                                            setSearch(item.search);
                                            if (!item.searchType.startsWith('length')) {
                                                fetchBooks(item.search, item.searchType);
                                            }
                                            setHistoryOpened(false);
                                        }}
                                    >
                                        {getHistoryLabel(item)}
                                    </Text>
                                ))}
                            </Flex>
                        </div>
                    )}
                </div>

                {/* Search results */}
                {matchingBooks.length > 0 && (
                    <ScrollArea
                        w="calc(100vw - 400px)"
                        mt="xl"
                        mb="xl"
                        style={{ flex: 1, minHeight: 0 }}
                        scrollbars="y"
                        type="auto"
                        offsetScrollbars
                    >
                        <SimpleGrid cols={2} spacing="md" verticalSpacing="xs" pr="sm">
                            {matchingBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    mode="recommendation"
                                    onAdd={() => {
                                        // Later: add book to bookshelf
                                    }}
                                />
                            ))}
                        </SimpleGrid>
                    </ScrollArea>
                )}
            </Flex>
        </Flex>
    );
}