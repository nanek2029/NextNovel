import { ActionIcon, Flex, Image, Menu, Stack,Text, Group} from '@mantine/core';
import {CaretDownIcon, PlusIcon, TrashIcon, } from '@phosphor-icons/react';


// book cards can be recommendation (add to bookshelf) or bookshelf mode(alter status, delete)

// type of book status
export type BookStatus = 'read' | 'reading' | 'want to read' | 'DNF';


// attributes of a book
export type Book = {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    thumbnail: string;
    status?: BookStatus;
};

// parameters of a bookcard component 
type BookCardProps = {
    book: Book;
    mode: 'bookshelf' | 'recommendation';
    status?: BookStatus;
    onStatusChange?: (status: BookStatus) => void;
    onRemove?: () => void;
    onAdd?: () => void;
};

export default function BookCard({ book, mode, status = 'want to read', onStatusChange, onRemove,onAdd,
}: BookCardProps) {

    const statuses: BookStatus[] = [
        'read',
        'reading',
        'want to read',
        'DNF',
    ];

    return (
        <Flex bg="#FFFFFF" w="100%" p="sm" gap="md" align="center"
            style={{
                aspectRatio: '10 / 3',
                border: '2px solid #d1dfce',
                borderRadius: 'var(--mantine-radius-lg)',
            }}
        >
            {/* Book thumbnail */}
            <Image src={book.thumbnail} alt={book.title} w={100} h={130} fit="cover" radius="md"
                fallbackSrc="https://placehold.co/80x115?text=No+Cover"
            />

            {/* Book information */}
            <Stack gap={3} style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                {/* Book title, author, genre */}
                <Text c="#3A5B22" fw={500} size="lg" lineClamp={2}>
                    {book.title}
                </Text>

                <Group gap="xs">
                    <Text c="#87CA00" fw={500} size="sm">
                        Author:
                    </Text>
                    <Text c="#637a4e" size="sm">
                        {book.author}
                    </Text>
                </Group>
                

                <Group gap="xs">
                    <Text c="#87CA00" fw={500} size="sm">
                        Genre:
                    </Text>
                    <Text c="#637a4e" size="sm">
                        {book.genre}
                    </Text>
                </Group>

                <Group gap="xs">
                    <Text c="#87CA00" fw={500} size="sm">
                        Year Published:
                    </Text>
                    <Text c="#637a4e" size="sm">
                        {book.year}
                    </Text>
                </Group>

                {/* If a bookcard is in bookshelf mode you can change its status and remove it from list */}
                {mode === 'bookshelf' && (
                    <Flex align="center" gap="xs" mt={4} >
                        {/* Drop down menu styles */}
                        <Menu position="bottom-start" width={140} shadow={undefined}
                            styles={{
                                dropdown: {
                                    border: '1px solid #80AA62',
                                    borderRadius: '12px',
                                    backgroundColor: '#FFFFFF',
                                    padding: '6px',
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
                            {/* Button to open menu styles*/}
                            <Menu.Target>
                                <Flex align="center" gap={4} px="sm" bg="#e7f4e0" py={5}
                                    style={{
                                        //border: "1.5px solid #d1dfce",
                                        borderRadius:
                                            'var(--mantine-radius-md)',
                                        cursor: 'pointer',
                                        width: 'fit-content',
                                    }}
                                >
                                    <Text c="#6f8b5b" size="sm" fw={500} >
                                        {status}
                                    </Text>

                                    <CaretDownIcon size={20} color="#6f8b5b" weight="bold" />
                                </Flex>
                            </Menu.Target>

                            <Menu.Dropdown>
                                {statuses.map((item) => (
                                    <Menu.Item
                                        key={item}
                                        onClick={() =>
                                            onStatusChange?.(item)
                                        }
                                    >
                                        {item}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                )}
            </Stack>

            {/* Trashcan icon */}
            {mode === 'bookshelf' && (
                <ActionIcon  variant="subtle" color="#3A5B22" radius="sm" size="lg" onClick={onRemove} >
                    <TrashIcon size={80} weight="regular" color="#c75f5f" />
                </ActionIcon>
            )}

            {/* If a bookcard is in recommendation mode you will only have the option to add it */}
            {mode === 'recommendation' && (
                <ActionIcon variant="subtle" color="#3A5B22" radius="xl" size="md" onClick={onAdd}>
                    <PlusIcon size={20} weight="bold" />
                </ActionIcon>
            )}
        </Flex>
    );
}