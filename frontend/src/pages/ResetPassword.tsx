import {
    Button,
    Container,
    Flex,
    PasswordInput,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = location.state?.token || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleResetPassword = async () => {
        let hasError = false;

        setPasswordError('');
        setConfirmPasswordError('');

        if (!password) {
            setPasswordError('Please fill out password field.');
            hasError = true;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please fill out password field.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        }

        if (!token) {
            setPasswordError('Reset token is missing.');
            return;
        }

        try {
            const response = await fetch(
                '/api/auth/reset-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                        newPassword: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.message || 'Unable to reset password.');
                return;
            }

            navigate('/login');
        } catch {
            setPasswordError('Unable to connect to the server.');
        }
    };

    return (
        <Flex
            bg="#FFFEF6"
            justify="center"
            align="center"
            style={{
                width: '100%',
                height: 'calc(100vh - 56px)',
            }}
        >
            <Container style={{ width: '100%', maxWidth: 420 }}>
                <Stack gap="lg">
                    <Title c="#3A5B22">
                        Create a new password
                    </Title>

                    <Text c="#637A4E">
                        Enter a new password for your account.
                    </Text>

                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password..."
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        error={passwordError}
                        c="#3A5B22"
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your new password..."
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                        error={confirmPasswordError}
                        c="#3A5B22"
                    />

                    <Button
                        color="#3A5B22"
                        c="#FFFEF6"
                        size="md"
                        onClick={handleResetPassword}
                    >
                        Reset password
                    </Button>

                    <Button
                        variant="subtle"
                        color="#3A5B22"
                        onClick={() => navigate('/reset-code')}
                    >
                        Back to reset token
                    </Button>
                </Stack>
            </Container>
        </Flex>
    );
}