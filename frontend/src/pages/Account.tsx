import { Avatar, Button, FileButton, Flex, PasswordInput,Stack, TextInput, Title,} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Account() {

    const navigate = useNavigate();

    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const username = 'username';
    const email = 'user@email.com';
    const password = 'password123';

    const profilePictureUrl = profilePicture
        ? URL.createObjectURL(profilePicture)
        : undefined;

    return (
        <Flex
            bg="#FFFEF6"
            justify="center"
            align="center"
            style={{
                width: '100%',
                height: 'calc(100vh - 56px)',
                overflow: 'hidden',
            }}
        >
            <Stack
                gap="md"
                align="center"
                style={{
                    width: '100%',
                    maxWidth: 600,
                    flexShrink: 0,
                }}
            >
                <Title
                    c="#3A5B22"
                    mb="md"
                    order={2}
                    ta="center"
                >
                    My Account
                </Title>

                <Flex
                    w="100%"
                    gap="xl"
                    align="center"
                    justify="center"
                >
                    {/* Profile picture */}
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        style={{ flex: 1 }}
                    >
                        <Avatar
                            src={profilePictureUrl}
                            size={150}
                            radius="xl"
                            color="#3A5B22"
                        >
                            {username.charAt(0).toUpperCase()}
                        </Avatar>

                        <FileButton
                            onChange={setProfilePicture}
                            accept="image/png,image/jpeg"
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    variant="subtle"
                                    color="#87CA00"
                                    mt="sm"
                                    style={{
                                        fontSize: 'var(--mantine-font-size-xs)',
                                        fontWeight: 500,
                                    }}
                                >
                                    Upload profile picture
                                </Button>
                            )}
                        </FileButton>
                    </Flex>

                    {/* User information */}
                    <Stack
                        gap="sm"
                        style={{ flex: 1 }}
                    >
                        <TextInput
                            c="#3A5B22"
                            label="Username"
                            value={username}
                            readOnly
                            styles={{
                                input: {
                                    backgroundColor: 'transparent',
                                    borderColor: 'transparent',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    color: '#637a4e'
                                },
                                label: {
                                    fontWeight: '500',
                                    fontSize: 'var(--mantine-font-size-md)',
                                },
                            }}
                        />

                        <TextInput
                            c="#3A5B22"
                            label="Email Address"
                            value={email}
                            readOnly
                            styles={{
                                input: {
                                    backgroundColor: 'transparent',
                                    borderColor: 'transparent',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    color: '#637a4e'
                                },
                                label: {
                                    fontWeight: '500',
                                    fontSize: 'var(--mantine-font-size-md)',
                                },
                            }}
                        />

                        <PasswordInput
                            c="#3A5B22"
                            label="Password"
                            value={password}
                            readOnly
                            styles={{
                                input: {
                                    backgroundColor: 'transparent',
                                    borderColor: 'transparent',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    color: '#637a4e'
                                },
                                label: {
                                    fontWeight: '500',
                                    fontSize: 'var(--mantine-font-size-md)',
                                },
                            }}
                        />
                    </Stack>
                </Flex>

                {/* Buttons */}
                <Stack w="100%" gap="sm" mt="md" > 
                  <Button c="#3A5B22" color="#DEEFC6" mb={0} w="100%" 
                    style={{ fontSize: 'var(--mantine-font-size-md)', }} 
                    onClick={() => navigate('/reset-password')} > 
                    Reset Password </Button> 
                    
                  <Button color="#3A5B22" mb={0} w="100%" 
                    style={{ fontSize: 'var(--mantine-font-size-md)', }} 
                    onClick={() => navigate('/')} > 
                    Log Out </Button> 
                </Stack>

            </Stack>
        </Flex>
    );
}

