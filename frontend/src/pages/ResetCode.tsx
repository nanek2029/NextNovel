import {
    Button,
    Container,
    Flex,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetCode() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || '';

    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const handleContinue = () => {
        if (!token.trim()) {
            setError('Please enter your reset token.');
            return;
        }

        setError('');

        navigate('/reset-password', {
            state: { token: token.trim() },
        });
    };

    const handleResendToken = async () => {
        if (!email) {
            navigate('/forgotpassword');
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/forgot-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Unable to resend reset token.');
            }
        } catch {
            setError('Unable to connect to the server.');
        }
    };

    return (
        <Flex
            bg="#FFFFE6"
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
                        Check your email
                    </Title>

                    <Text c="#637A4E">
                        Enter the password reset token we sent to your email address.
                    </Text>

                    <TextInput
                        label="Reset Token"
                        placeholder="Paste your reset token..."
                        value={token}
                        onChange={(event) => setToken(event.currentTarget.value)}
                        error={error}
                        c="#3A5B22"
                    />

                    <Button
                        color="#3A5B22"
                        c="#FFFFE6"
                        size="md"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>

                    <Button
                        variant="subtle"
                        color="#3A5B22"
                        onClick={handleResendToken}
                    >
                        Resend token
                    </Button>

                    <Button
                        variant="subtle"
                        color="#3A5B22"
                        onClick={() => navigate('/forgotpassword')}
                    >
                        Back to forgot password
                    </Button>
                </Stack>
            </Container>
        </Flex>
    );
}