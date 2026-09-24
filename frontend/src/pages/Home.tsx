import { Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Smiley, } from "@phosphor-icons/react";


export default function Home() {
  const navigate = useNavigate();

  return (
    <Flex mt="md" bg="var(--bg-color" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        <p>placeholder home screen</p>
        <Smiley size={32} color="blue" weight="bold" />
        <Button onClick={() => navigate('/login')}>Login link</Button>
    </Flex>
  );
}
