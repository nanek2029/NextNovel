import { Group, Text, Image, Title, Container, Stack, Button, PasswordInput, TextInput, Flex, Checkbox } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useState} from 'react'; 
import Signup_pic from '../assets/sign_up_pic.jpg';

// in the future the search results will show the book card component instead of just the text

//sign up backend endpoint
export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup= async () => {
        setError('');

        // Input validation matching backend requirements
        if (!username.trim() || !email.trim() || !password) {
            setError('Username, email, and password are required.');
            return;
        }

        // Email format validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address.');
            return;
        }

        // Password length validation matching backend check (at least 8 characters)
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // redirect to email verification page on success
            navigate('/verify');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

return ( <>
<Flex bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
    <Flex justify="center" align="center" style={{ flex: 4.5, height: '100%', padding: '2rem' }}>
            
        <Container strategy="grid" style={{width: '100%', maxWidth: 320, flexShrink: 0 }}>

            <Stack>
                <Title c="#3A5B22" mb="xl" order={2}>Wondering what to read next?</Title>
                {error && <Text c="red" size="sm">{error}</Text>}
                
                <TextInput
                    c="#3A5B22"
                    label="Name"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    styles={{ input: {
                                backgroundColor: 'transparent',
                                borderColor: '#D9D9D9'},
                            label: {fontWeight: '500', fontSize: 'var(--mantine-font-size-md'}}}
                    />

                <TextInput
                    c="#3A5B22"
                    label="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    placeholder="Enter your email address..."
                    styles={{ input: {
                                backgroundColor: 'transparent',
                                borderColor: '#D9D9D9'},
                            label: {fontWeight: '500', fontSize: 'var(--mantine-font-size-md'}}}
                    />

                <Stack gap={10} mb="md">
                    <PasswordInput 
                        c="#3A5B22"
                        
                        label={
                            <Group justify="space-between" style={{ width: '100%' }}>
                                <span style={{fontWeight: '500', fontSize: 'var(--mantine-font-size-md'}}>Password</span>
                            </Group>
                        }
                        placeholder="Enter your password..."
                        styles={{ label: {width: '100%'}, input: {
                                    backgroundColor: 'transparent',
                                    borderColor: '#D9D9D9'},}}
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        />

                        {/* not collected in user schema so removed */}
                    {/*<Checkbox size="xs" color="#3A5B22" label="I agree to the terms and services" styles={{ label:{color:'#3A5B22', fontWeight: '500'}}}/> */}

                </Stack>
                
                <Button loading={loading} onClick={handleSignup} color="#3A5B22" mb={0} style={{fontSize: 'var(--mantine-font-size-md'}} >Create Account</Button>

                <Group mt="-xs" mb="lg" justify="center" gap={3}> 
                    <Text style={{fontWeight: '500', fontSize: 'var(--mantine-font-size-xs', color:'#637a4e'}}>Have an account?</Text>
                    <Link style={{fontWeight: '500',fontSize: 'var(--mantine-font-size-xs', color: '#87CA00' }}to="/login">Sign in</Link>
                </Group>

            </Stack>

            </Container>
        </Flex>

        <Flex 
            style={{ 
                flex: 5.5, 
                height: '100%', 
                position: 'relative',
                borderTopLeftRadius: 'var(--mantine-radius-xl)', 
                borderBottomLeftRadius: 'var(--mantine-radius-xl)',
                overflow: 'hidden' 
            }}>

            <Image 
                style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: '80% center'
                }} 
                src={Signup_pic} 
            /> 

            <div 
                style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,172,0.2)',
                pointerEvents: 'none'
                }}
            />
            </Flex> 

    </Flex>
    </>
  );
}