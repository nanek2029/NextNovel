import {Button, Container, Flex, Group, Image, Stack, Text, TextInput, Title} from '@mantine/core';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VerifyEmailPic from '../assets/verify_email_pic.jpg';
import { CaretLeftIcon } from '@phosphor-icons/react';

export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialEmail = location.state?.email || '';
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loadingAction, setLoadingAction] = useState<'verify' | 'resend' | null>(null);

    const handleResend = async () => {
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setError('');
        setMessage('');
        setLoadingAction('resend');

        try {
            const response = await fetch('/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to send verification email.');
            }

            setMessage(data.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to connect to the server.');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleVerify = async () => {
        if (!email.trim() || !code.trim()) {
            setError('Please enter your email and verification code.');
            return;
        }

        setError('');
        setMessage('');
        setLoadingAction('verify');

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    code: code.trim(),
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to verify email.');
            }

            navigate('/login', {
                state: { message: 'Email verified. You can now sign in.' },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to connect to the server.');
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <>
            <div style={{ position: 'absolute', top: '5rem', left: '1rem', zIndex: 10 }}>
                <Link to="/signup">
                    <CaretLeftIcon weight="bold" color="#3A5B22" size={32} />
                </Link>
            </div>

            <Flex bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
                <Flex justify="center" align="center" style={{ flex: 4.5, height: '100%', padding: '2rem' }}>
                    <Container style={{ width: '100%', maxWidth: 320, flexShrink: 0 }}>
                        <Stack>
                            <Title c="#3A5B22" mb="xl" order={2}>Verify your email</Title>

                            <Text c="#637A4E" size="sm">
                                Enter the six-digit code sent to your email address.
                            </Text>

                            <TextInput
                                label="Email Address"
                                placeholder="Enter your email address..."
                                value={email}
                                onChange={(event) => setEmail(event.currentTarget.value)}
                                disabled={Boolean(initialEmail)}
                                error={error}
                                c="#3A5B22"
                            />

                            <TextInput
                                label="Verification code"
                                placeholder="Enter the code..."
                                value={code}
                                onChange={(event) => setCode(event.currentTarget.value)}
                                maxLength={6}
                                c="#3A5B22"
                            />

                            {message && <Text c="green" size="sm">{message}</Text>}

                            <Button
                                loading={loadingAction === 'resend'}
                                disabled={loadingAction !== null}
                                onClick={handleResend}
                                c="#3A5B22"
                                color="#DEEFC6"
                            >
                                Send code to email
                            </Button>

                            <Button
                                loading={loadingAction === 'verify'}
                                disabled={loadingAction !== null}
                                onClick={handleVerify}
                                color="#3A5B22"
                            >
                                Submit code
                            </Button>

                            <Group justify="center" gap={3}>
                                <Text size="xs" c="#637A4E">Don't have an account?</Text>
                                <Link style={{ fontWeight: '500', fontSize: 'var(--mantine-font-size-xs)', color: '#87CA00' }} to="/signup">
                                    Register
                                </Link>
                            </Group>
                        </Stack>
                    </Container>
                </Flex>

                <Flex style={{ flex: 5.5, height: '100%', position: 'relative', borderTopLeftRadius: 'var(--mantine-radius-xl)', borderBottomLeftRadius: 'var(--mantine-radius-xl)', overflow: 'hidden' }}>
                    <Image style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '80% center' }} src={VerifyEmailPic} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,172,0.2)', pointerEvents: 'none' }} />
                </Flex>
            </Flex>
        </>
    );
}
