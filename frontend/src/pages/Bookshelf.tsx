import { Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';


export default function Bookshelf() {
  const navigate = useNavigate();

  return (
    <Flex mt="md" bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        <p>This is where the bookshelf will go</p>
        <Button onClick={() => navigate('/')}>home link</Button>
    </Flex>
  );
}