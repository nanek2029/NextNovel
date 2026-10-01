import { Flex, Autocomplete, rem, ActionIcon, Menu, Divider, Text, SimpleGrid, Button, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XIcon } from '@phosphor-icons/react';
import BookCard from '../secondary/BookCard';
import { dummyBookData } from '../secondary/dummyBookData';

type SearchHistoryItem = {
    search: string;
    searchType: string;
};

export default function Search() {
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [historyOpened, setHistoryOpened] = useState(false);

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

    // Books to display
    const matchingBooks =
        searchType === 'length-asc'
            ? [...dummyBookData].sort((a, b) => a.length - b.length)
            : searchType === 'length-desc'
                ? [...dummyBookData].sort((a, b) => b.length - a.length)
                : search.length > 0
                    ? dummyBookData.filter((book) => {
                        if (searchType === 'title') {
                            return book.title.toLowerCase().includes(search.toLowerCase());
                        }

                        if (searchType === 'author') {
                            return book.author.toLowerCase().includes(search.toLowerCase());
                        }

                        return book.genre.toLowerCase().includes(search.toLowerCase());
                    })
                    : [];

    // Add search to history
    const addToHistory = () => {
        if (search.length === 0 && searchType !== 'length-asc' && searchType !== 'length-desc') {
            return;
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

    // where you can change input placeholder dpedning on filter active
    const placeholder =
        searchType === 'title'
            ? 'Search a book title...'
            : searchType === 'author'
                ? 'Search by author...'
                : searchType === 'genre'
                    ? 'Search by genre...'
                    : searchType === 'length-asc'
                        ? '(Ascending)'
                        : '(Descending)';

    // display name for history
    const getHistoryLabel = (item: SearchHistoryItem) => {
        if (item.searchType === 'length-asc') {
            return 'Length (shortest first)';
        }

        if (item.searchType === 'length-desc') {
            return 'Length (longest first)';
        }

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
                                {/* X button to clear input */}
                                {search.length > 0 && (
                                    <ActionIcon variant="subtle" color="#3A5B22" radius="xl" size="sm" onClick={() => setSearch('')}>
                                        <XIcon size={16} weight="bold" />
                                    </ActionIcon>
                                )}

                                {/* Filter by title/author/genre/length */}
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
                                        label: {
                                            color: '#3A5B22',
                                            fontSize: 'var(--mantine-font-size-sm)',
                                            fontWeight: 500,
                                        },
                                        item: {
                                            color: '#3A5B22',
                                            fontSize: 'var(--mantine-font-size-sm)',
                                            borderRadius: '8px',
                                        },
                                        itemLabel: {
                                            color: '#3A5B22',
                                        },
                                    }}
                                >
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="#3A5B22" radius="xl" size="sm">
                                            <FunnelIcon size={18} weight="bold" />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>Search by</Menu.Label>

                                        <Menu.Item onClick={() => {
                                            setSearchType('title');
                                            setSearch('');
                                        }}>
                                            Title
                                        </Menu.Item>

                                        <Menu.Item onClick={() => {
                                            setSearchType('author');
                                            setSearch('');
                                        }}>
                                            Author
                                        </Menu.Item>

                                        <Menu.Item onClick={() => {
                                            setSearchType('genre');
                                            setSearch('');
                                        }}>
                                            Genre
                                        </Menu.Item>

                                        <Menu.Item onClick={() => {
                                            setSearchType('length-asc');
                                            setSearch('');
                                        }}>
                                            Length (shortest first)
                                        </Menu.Item>

                                        <Menu.Item onClick={() => {
                                            setSearchType('length-desc');
                                            setSearch('');
                                        }}>
                                            Length (longest first)
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Flex>
                        }
                        rightSectionWidth={75}
                        mt="xl"
                        radius={historyOpened ? '12px 12px 0 0' : 'xl'}
                        w="100%"
                        styles={{
                            label: {
                                fontWeight: '500',
                                fontSize: 'var(--mantine-font-size-xl)',
                                color: '#3A5B22',
                            },
                            input: {
                                height: rem(50),
                                fontSize: 'var(--mantine-font-size-md)',
                                paddingRight: rem(75),
                                '--input-bd-focus': '#80AA62',
                                '--input-focus-ring-color': '#80AA62',
                                borderColor: historyOpened ? '#80AA62' : undefined,
                            },
                            dropdown: {
                                border: 'none',
                                backgroundColor: 'transparent',
                                padding: 0,
                            },
                            option: {
                                display: 'none',
                            },
                        }}
                    />

                    {/* Recent searches dropdown */}
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
                                <Text size="sm" fw={500} c="#3A5B22">
                                    Recent searches
                                </Text>

                                <Button variant="subtle" color="#3A5B22" size="compact-sm"
                                    onClick={() => {
                                        setSearchHistory([]);
                                        setHistoryOpened(false);
                                    }}
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
                        styles={{
                            scrollbar: {
                                '&[data-orientation="vertical"]': {
                                    width: rem(8),
                                },
                            },
                            thumb: {
                                backgroundColor: '#80AA62',
                                borderRadius: rem(10),
                            },
                        }}
                    >
                        {/* display books search result in grid  */}
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