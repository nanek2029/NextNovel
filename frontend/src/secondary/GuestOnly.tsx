import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Loader } from '@mantine/core';
import { apiFetch, getAccessToken, refreshAccessToken } from './authClient';

interface GuestOnlyProps {
    children: React.ReactNode;
}

export default function GuestOnly({ children }: GuestOnlyProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const verifyGuest = async () => {
            try {
                if (!getAccessToken()) {
                    await refreshAccessToken();
                }
                const response = await apiFetch('/api/auth/account');
                setIsGuest(!response.ok);

                if (response.ok) {
                    navigate('/account');
                }
            } catch {
                setIsGuest(true);
            } finally {
                setIsLoading(false);
            }
        };

        verifyGuest();
    }, [navigate]);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" style={{ width: '100%', height: 'calc(100vh - 56px)' }}>
                <Loader color="#3A5B22" size="lg" />
            </Flex>
        );
    }

    if (!isGuest) {
        return null;
    }

    return <>{children}</>;
}
