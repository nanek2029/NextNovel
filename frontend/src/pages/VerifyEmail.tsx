import { Group, Text, Image, Title, Container, Stack, Button, PasswordInput, TextInput, Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useState} from 'react'; 
import VerifyEmail_pic from '../assets/verify_email_pic.jpg';
import { CaretLeftIcon, } from "@phosphor-icons/react";
export default function VerifyEmail() {

    const [value, setValue] = useState('');

return ( <>

<div style={{ position: 'absolute', top: '5rem', left: '1rem', zIndex: 10 }}>
    <Link to="/signup">
        <CaretLeftIcon weight="bold" color="#3A5B22" size={32} />
    </Link>
</div>

<Flex bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
    
    <Flex justify="center" align="center" style={{ flex: 4.5, height: '100%', padding: '2rem' }}>
            
        <Container strategy="grid" style={{width: '100%', maxWidth: 320, flexShrink: 0 }}>


            <Stack>
                <Title c="#3A5B22" mb="xl" order={2}>Verify your email</Title>

                <TextInput
                    c="#3A5B22"
                    label="Enter the code sent to your email"
                    placeholder="Enter the code..."
                    mb="lg"
                    styles={{ input: {
                                backgroundColor: 'transparent',
                                borderColor: '#D9D9D9'},
                            label: {fontWeight: '500', fontSize: 'var(--mantine-font-size-md'}}}
                    />

                 <Button c="#3A5B22" color="#DEEFC6" mt="sm" mb={0} style={{fontSize: 'var(--mantine-font-size-md'}} >Send code to email</Button>
                <Button color="#3A5B22" mb={0} style={{fontSize: 'var(--mantine-font-size-md'}} >Submit code</Button>

                <Group mt="-xs" mb="lg" justify="center" gap={3}> 
                    <Text style={{fontWeight: '500', fontSize: 'var(--mantine-font-size-xs', color:'#637a4e'}}>Don't have an account?</Text>
                    <Link style={{fontWeight: '500',fontSize: 'var(--mantine-font-size-xs', color: '#87CA00' }}to="/signup">Register</Link>
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
                src={VerifyEmail_pic} 
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
