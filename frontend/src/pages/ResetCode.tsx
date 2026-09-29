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
import { useNavigate } from 'react-router-dom';

export default function ResetCode() {
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleVerifyCode = () => {
        if (!code.trim()) {
            setError('Please enter the verification code.');
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            setError('Please enter a 6-digit verification code.');
            return;
        }

        setError('');

        // backend request to verify the code
        navigate('/reset-password');
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
                        Enter the verification code we sent to your email address.
                    </Text>

                    <TextInput
                        label="Verification Code"
                        placeholder="Enter your code..."
                        value={code}
                        onChange={(event) => setCode(event.currentTarget.value)}
                        error={error}
                        c="#3A5B22"
                        maxLength={6}
                    />

                    <Button
                        color="#3A5B22"
                        c="#FFFFE6"
                        size="md"
                        onClick={handleVerifyCode}
                    >
                        Verify code
                    </Button>

                    <Button
                        variant="subtle"
                        color="#3A5B22"
                        onClick={() => {
                            // backend logic for resending code
                        }}
                    >
                        Resend code
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