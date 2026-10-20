import { Link, useLocation } from 'react-router-dom';
import { Burger, Container, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.scss';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

const links = [
  { link: '/', label: 'Home' },
  { link: '/login', label: 'Log In' },
  { link: '/signup', label: 'Register' },
  { link: '/bookshelf', label: 'Bookshelf'},
  { link: '/recommendation', label: 'Find Your NextNovel'},
  { link: '/account', label: 'My Account'},
  
];

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount and when location changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/account');
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, [location]);

  // dont show some buttons based on login status 
  const filteredLinks = links.filter((link) => {
    if (isLoggedIn && (link.link === '/login' || link.link === '/signup')) {
      return false; // hide Log In and Register when logged in
    }
    if (!isLoggedIn && link.link === '/account') {
      return false; // hide My Account when logged out
    }
    return true;
  });

  const items = filteredLinks.map((link) => (

    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
      onClick={close} 
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container fluid p={13} size="md" className={classes.inner}>

        <Group gap="md">
          <Link to="/">
            <img width={30} src="/nextnovel_fav.png" alt="Logo" />
          </Link>

          <Link to="/search" className={classes.searchLink}>
            <MagnifyingGlassIcon size={20} weight="bold" />
            <span>Search a book title...</span>
          </Link>
        </Group>
        
        
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" aria-label="Toggle navigation" />
      </Container>
      <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Navigation" hiddenFrom="xs" zIndex={1000000}>
        <ScrollArea h="calc(100vh - 80px)">
          <Divider my="sm" />
          {items}
        </ScrollArea>
      </Drawer>
    </header>
  );
}