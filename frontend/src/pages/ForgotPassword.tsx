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

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');

    try {
      const response = await fetch(
          '/api/auth/forgot-password',
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
        setError(data.message || 'Unable to send password reset email.');
        return;
      }

      navigate('/reset-code', {
        state: { email },
      });
    } catch {
      setError('Unable to connect to the server.');
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
            Forgot your password?
          </Title>

          <Text c="#637A4E">
            Enter the email associated with your account and we'll send you a
            password reset token.
          </Text>

          <TextInput
            label="Email Address"
            placeholder="Enter your email..."
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            error={error}
            c="#3A5B22"
          />

          <Button
            color="#3A5B22"
            c="#FFFEF6"
            size="md"
            onClick={handleSendCode}
          >
            Send reset token
          </Button>

          <Button
            variant="subtle"
            color="#3A5B22"
            onClick={() => navigate('/login')}
          >
            Back to login
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
}