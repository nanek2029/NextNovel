import { Button, Flex, Table, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserTable from '../secondary/userTable';

//  Dashboard that only admin can access
// 


export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Flex bg="#FFFEF6" direction="row" align="flex-start" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        
        <Flex mt="xl" direction="column" align="center"> 
            <Title mt="xl" c="#3A5B22" order={1}>Welcome, Admin.</Title>
            <Text  mb="xl" c="#637a4e" fw={500} size="lg">Manage your users here!</Text>
            <Flex justify='center' mt="md" bg="white" style={{ justifyContent: 'center', border: '1px solid #d1dfce', width: '85%', overflow: 'hidden', borderRadius: 'var(--mantine-radius-lg)'}}>
                <UserTable/>   
            </Flex>
        </Flex>
        
         
    </Flex>
  );
}