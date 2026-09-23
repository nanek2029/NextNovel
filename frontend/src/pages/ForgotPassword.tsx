import { Button, } from '@mantine/core';
import { useNavigate } from 'react-router-dom';


export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div>
        <p>placeholder forgot password screen</p>
        <Button onClick={() => navigate('/')}>home link</Button>
    </div>
  );
}