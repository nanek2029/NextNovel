import { Flex, Autocomplete, rem, ActionIcon, Menu, Divider, Text, } from '@mantine/core';
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XIcon, ClockCounterClockwiseIcon, } from '@phosphor-icons/react';

export default function Search() {
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // dummy data to be replaced with dummy data of full book card
    const dummy_data = [
        'Into the Wild',
        'Fire and Ice',
        'Forest of Secrets',
        'Rising Storm',
        'A Dangerous Path',
        'The Darkest Hour',
    ];

    // only show autocomplete when typing 
    const autocomp =
        search.length > 0
            ? dummy_data.filter((book) =>
                book.toLowerCase().includes(search.toLowerCase())
            )
            : [];

    // input placeholder changes by filter selection
    const placeholder =
        searchType === 'title'
            ? 'Search a book title...'
            : searchType === 'author'
                ? 'Search by author...'
                : 'Search by genre...';

    return (
        <Flex bg="#FFFEF6">
            <Flex
                justify="flex-start"
                align="center"
                direction="column"
                mt="md"
                style={{
                    width: '100%',
                    height: 'calc(100vh - 56px)',
                    overflow: 'hidden',
                }}
            >
                <Autocomplete
                    value={search}
                    onChange={setSearch}

                    // Only add to search history when an autocomplete
                    // result is clicked
                    onOptionSubmit={(value) => {
                        setSearch(value);

                        setSearchHistory((previous) => {
                            const updatedHistory = [
                                value,
                                ...previous.filter((item) => item !== value),
                            ];

                            return updatedHistory.slice(0, 5);
                        });
                    }}

                    label="Search for a book"
                    placeholder={placeholder}
                    data={autocomp}
                    leftSection={
                        <MagnifyingGlassIcon
                            color="#80AA62"
                            size={20}
                            weight="bold"
                        />
                    }
                    rightSection={
                        <Flex align="center" gap={4}>
                            {/* X button to clear input */}
                            {search.length > 0 && (
                                <ActionIcon
                                    variant="subtle"
                                    color="#3A5B22"
                                    radius="xl"
                                    size="sm"
                                    onClick={() => setSearch('')}
                                >
                                    <XIcon
                                        size={16}
                                        weight="bold"
                                    />
                                </ActionIcon>
                            )}

                            {/* Filter by title/author/genre */}
                            <Menu
                                width={150}
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
                                        fontSize:
                                            'var(--mantine-font-size-sm)',
                                        fontWeight: 500,
                                    },

                                    item: {
                                        color: '#3A5B22',
                                        fontSize:
                                            'var(--mantine-font-size-sm)',
                                        borderRadius: '8px',
                                    },

                                    itemLabel: {
                                        color: '#3A5B22',
                                    },
                                }}
                            >
                                <Menu.Target>
                                    <ActionIcon
                                        variant="subtle"
                                        color="#3A5B22"
                                        radius="xl"
                                        size="sm"
                                    >
                                        <FunnelIcon
                                            size={18}
                                            weight="bold"
                                        />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>
                                        Search by
                                    </Menu.Label>

                                    <Menu.Item
                                        onClick={() => {
                                            setSearchType('title');
                                            setSearch('');
                                        }}
                                    >
                                        Title
                                    </Menu.Item>

                                    <Menu.Item
                                        onClick={() => {
                                            setSearchType('author');
                                            setSearch('');
                                        }}
                                    >
                                        Author
                                    </Menu.Item>

                                    <Menu.Item
                                        onClick={() => {
                                            setSearchType('genre');
                                            setSearch('');
                                        }}
                                    >
                                        Genre
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Flex>
                    }
                    rightSectionWidth={75}
                    mt="xl"
                    radius="xl"
                    w="calc(100vw - 400px)"
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
                        },

                        // Autocomplete dropdown
                        dropdown: {
                            border: '1px solid #80AA62',
                            borderRadius: '25px',
                            backgroundColor: '#FFFFFF',
                            padding: '6px',
                        },

                        option: {
                            color: '#3A5B22',
                            fontSize: '14px',
                            borderRadius: '8px',
                        },
                    }}
                    limit={5}
                />

                {/* Search history */}
                {searchHistory.length > 0 && (
                    <Flex
                        direction="column"
                        w="calc(100vw - 400px)"
                        mt="md"
                    >
                        <Divider color="#80AA62" />

                        <Text
                            mt="sm"
                            mb="xs"
                            size="sm"
                            fw={500}
                            c="#3A5B22"
                        >
                            Recent searches
                        </Text>

                        {searchHistory.map((item, index) => (
                            <Flex
                                key={`${item}-${index}`}
                                align="center"
                                gap="sm"
                                py={6}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                }}
                                onClick={() => setSearch(item)}
                            >
                                <ClockCounterClockwiseIcon
                                    size={18}
                                    color="#80AA62"
                                />

                                <Text
                                    size="sm"
                                    c="#3A5B22"
                                >
                                    {item}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}