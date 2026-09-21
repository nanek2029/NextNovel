import { Button, } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Smiley, } from "@phosphor-icons/react";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
        <p>placeholder home screen</p>
        <Smiley size={32} color="blue" weight="bold" />
        <Button onClick={() => navigate('/login')}>Login link</Button>
    </div>
  );
}
