import { Button,  } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

return (
    <div>
        <p>placeholder login</p>
        <Button onClick={() => navigate('/')}>back to home</Button>
    </div>
  );
}
