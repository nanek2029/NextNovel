import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Loader } from '@mantine/core';

interface checkStatusProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

// this protects the pages that need login status or admin status 
// so someone can't just type in the url and access the page 

export default function CheckStatus({ children, adminOnly = false }: checkStatusProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {

    const verifyAuth = async () => {

      try {
        const response = await fetch('/api/auth/account');
        const data = await response.json();

        if (response.ok) {
          if (adminOnly && data.user.role !== 'admin') {
            navigate('/'); // logged in, not an admin
          } else {
            setIsAuthorized(true);
          }
        } else {
          navigate('/login'); // Not logged in
        }

      } catch (error) {
        navigate('/login');

      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate, adminOnly]);

  // load sign while checking status
  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ width: '100%', height: 'calc(100vh - 56px)' }}>
        <Loader color="#3A5B22" size="lg" />
      </Flex>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}