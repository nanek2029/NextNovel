import { Group, Text, Image, Title, Container, Stack, Button, PasswordInput, TextInput, Flex, Checkbox } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useState} from 'react'; 
import Signup_pic from '../assets/sign_up_pic.jpg';

export default function Login() {

    const [value, setValue] = useState('');

return ( <>
<Flex bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
    <Flex justify="center" align="center" style={{ flex: 4.5, height: '100%', padding: '2rem' }}>
            
        <Container strategy="grid" style={{width: '100%', maxWidth: 320, flexShrink: 0 }}>

            <Stack>
                <Title c="#3A5B22" mb="xl" order={2}>Wondering what to read next?</Title>

                <TextInput
                    c="#3A5B22"
                    label="Name"
                    placeholder="Enter your name..."
                    styles={{ input: {
                                backgroundColor: 'transparent',
                                borderColor: '#D9D9D9'},
                            label: {fontWeight: '500', fontSize: 'var(--mantine-font-size-md'}}}
                    />

                <TextInput
                    c="#3A5B22"
                    label="Email Address"
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
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                        />

                    <Checkbox size="xs" color="#3A5B22" label="I agree to the terms and services" styles={{ label:{color:'#3A5B22', fontWeight: '500'}}}/>

                </Stack>
                
                <Button color="#3A5B22" mb={0} style={{fontSize: 'var(--mantine-font-size-md'}} >Sign in</Button>

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
