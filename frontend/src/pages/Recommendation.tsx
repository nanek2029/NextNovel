import { Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

// This file contains the ai recommendation feature 


export default function Recommendation() {
  const navigate = useNavigate();

  return (
    <Flex mt="md" bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        <p>This is where the ai recommendation feature will go.</p>
    
        <Button onClick={() => navigate('/')}>home link</Button>
    </Flex>
  );
}