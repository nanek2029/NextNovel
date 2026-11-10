import { useEffect, useState } from 'react';
import { TrashIcon, CaretDownIcon } from '@phosphor-icons/react';
import { Table, Loader, Text, Center, ActionIcon, Menu, Flex } from '@mantine/core';

// Inspired by mantine ui  https://mantine.dev/core/table/ table component 

export type User = {
    id: string;
    username: string;
    email: string;
    role: string;
};

const statuses = ['USER', 'ADMIN'];

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/users');

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUsers(data.users);
            } catch (err : any) {
                setError(err.message || 'Error loading users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    //deleting a user
   const handleDelete = async (identifier: string) => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            const response = await fetch(`/api/admin/users/${identifier}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user on server');
            }
            setUsers(users.filter((user) => (user.id) !== identifier));
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            alert(err.message || 'Could not delete user.');
        }
    }
   };

    // changing role of a user 
    const handleRoleChange = async (identifier: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${identifier}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole === "ADMIN" ? "admin" : "user" }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Could not change user role');
            }

            const data = await response.json();
            const updatedUser = data.user;

          setUsers(users.map(user => {
            if (user.id === identifier) {
                return { ...user, role: updatedUser.role };
            }
            return user;
        }));

        } catch (err: any) {
            console.error('Role update failed:', err);
            alert(err.message || 'Could not update role.');
        }
    };

    if (loading) {
        return (
            <Center p="xl" h={400}>
                <Loader color="#80AA62" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center p="xl" h={400}>
                <Text c="red">Error loading users: {error}</Text>
            </Center>
        );
    }

    const headerStyle = {
        backgroundColor: '#e7f4e0', 
        color: '#3A5B22',       
        fontWeight: 600,
    };

    const bodyStyle = {
        color: '#3A5B22',       
    };

    return (
        <Table.ScrollContainer type="native" w="100%" style={{overflow:'hidden'}} minWidth={760}>
            <Table w="100%" stickyHeader layout="fixed">
                <Table.Thead style={{borderRadius: 'var(--mantine-radius-md)', backgroundColor:"#e7f4e0"}}>
                    <Table.Tr>
                        <Table.Th w={20} style={headerStyle}>#</Table.Th>
                        <Table.Th w={50} style={headerStyle}>Username</Table.Th>
                        <Table.Th w={50} style={headerStyle}>Email</Table.Th>
                        <Table.Th w={40} style={headerStyle}>Role</Table.Th>
                        <Table.Th w={20} style={headerStyle}>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {users.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={5} align="center">
                                <Text c="dimmed" py="md">No users found.</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        users.map((user, index) => (
                            <Table.Tr key={ user.id}>
                                <Table.Td style={bodyStyle}>{index + 1}</Table.Td>
                                <Table.Td style={bodyStyle}>{user.username }</Table.Td>
                                <Table.Td style={bodyStyle}>{user.email}</Table.Td>
                                <Table.Td>
                                    <Menu 
                                            position="bottom-start" 
                                            width={140} 
                                            shadow={undefined}
                                            offset={4}
                                            styles={{
                                                dropdown: {
                                                    border: '1.5px solid #80AA62',
                                                    borderRadius: '12px',
                                                    backgroundColor: '#FFFFFF',
                                                    padding: '6px',
                                                },
                                                item: {
                                                    color: '#3A5B22',
                                                    fontSize: 'var(--mantine-font-size-sm)',
                                                    borderRadius: 'var(--mantine-radius-lg)',
                                                },
                                                itemLabel: {
                                                    color: '#3A5B22',
                                                },
                                            }}
                                        >
                                            <Menu.Target>
                                                <Flex 
                                                    align="center" 
                                                    gap={4} 
                                                    px="sm" 
                                                    bg={user.role === 'admin' ? '#81ae61' : '#e7f4e0'}
                                                    py={5}
                                                    style={{
                                                        borderRadius: 'var(--mantine-radius-lg)',
                                                        cursor: 'pointer',
                                                        width: 'fit-content',
                                                    }}
                                                >
                                                    <Text c={user.role === 'admin' ? '#FFFFFF' : '#6f8b5b'} size="sm" fw={500}>
                                                        {user.role === 'admin' ? 'ADMIN' : 'USER'}
                                                    </Text>
                                                    <CaretDownIcon size={20} color={user.role === 'admin' ? '#FFFFFF' : '#6f8b5b'} weight="bold" />
                                                </Flex>
                                            </Menu.Target>

                                            <Menu.Dropdown>
                                                {statuses.map((item) => (
                                                    <Menu.Item
                                                        key={item}
                                                        onClick={() => handleRoleChange(user.id, item)}
                                                    >
                                                        {item}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Dropdown>
                                        </Menu> 
                                    </Table.Td>

                                <Table.Td>
                                    <ActionIcon  variant="subtle" color="#3A5B22" radius="sm" size="lg" onClick={() => handleDelete(user.id)} >
                                        <TrashIcon size={80} weight="regular" color="#c75f5f" />
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}