import { useEffect, useState } from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import { Table, Loader, Text, Center, Badge, ActionIcon } from '@mantine/core';

// Inspired by mantine ui  https://mantine.dev/core/table/ table component 

//  dummy user data for testing
export type User = {
    username: string;
    email: string;
    role: string;
};

const dummy_user_data: User[] = [
    { username: 'nane_k', email: 'nane@example.com', role: 'user' },
    { username: 'brady_h', email: 'brady@example.com', role: 'user' },
    { username: 'omar_z', email: 'omar@nextnovel.com', role: 'admin'},
    { username: 'grayson_c', email: 'grayson@example.com', role: 'user' },
];

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
                setUsers(data);
            } catch (err) {
                setUsers(dummy_user_data);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    //deleting a user
   const handleDelete = async (identifier: string) => {
        try {
            const response = await fetch(`/api/admin/users/${identifier}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user on server');
            }
            setUsers(users.filter((user) => (user.username) !== identifier));
        } catch (err: any) {

            // Fallback for dummy data testing or if backend route isn't hit
            setUsers(users.filter((user) => user.username !== identifier));
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
        <Table.ScrollContainer type="native" w="100%" style={{overflow:'hidden'}} minWidth={760} maxHeight={400}>
            <Table w="100%" stickyHeader layout="fixed">
                <Table.Thead style={{borderRadius: 'var(--mantine-radius-md)', backgroundColor:"#e7f4e0"}}>
                    <Table.Tr>
                        <Table.Th w={30} style={headerStyle}>#</Table.Th>
                        <Table.Th w={120} style={headerStyle}>Username</Table.Th>
                        <Table.Th w={120} style={headerStyle}>Email</Table.Th>
                        <Table.Th w={30} style={headerStyle}>Role</Table.Th>
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
                            <Table.Tr key={ index}>
                                <Table.Td style={bodyStyle}>{index + 1}</Table.Td>
                                <Table.Td style={bodyStyle}>{user.username }</Table.Td>
                                <Table.Td style={bodyStyle}>{user.email}</Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={user.role === 'admin' ? '#3A5B22' : '#80AA62'}
                                        variant="light"
                                    >
                                        {user.role || 'user'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <ActionIcon  variant="subtle" color="#3A5B22" radius="sm" size="lg" onClick={() => handleDelete(user.username)} >
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