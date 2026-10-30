import { Link, useLocation } from 'react-router-dom';
import { Burger, Container, Divider, Drawer, Group, ScrollArea, Menu, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.scss';
import { MagnifyingGlassIcon, CaretDown } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

const links = [
  { link: '/', label: 'Home' },
  { link: '/login', label: 'Log In' },
  { link: '/signup', label: 'Register' },
  { link: '/bookshelf', label: 'Bookshelf'},
  { label: 'Find Your NextNovel', 
    subItems: [
      { link: '/questionnaire', label: 'Questionnaire' },
      { link: '/recommendation', label: 'Find Similar Book' }
    ]
  },
  { link: '/account', label: 'My Account' }, 
  {link: '/admin-dashboard', label: 'Admin Dashboard', admin: true}
];

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login status on mount and when location changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/account');
        if (response.ok) {
          setIsLoggedIn(true);
          // setIsAdmin(response.role === 'admin'); // checking for user role . disabled bc user doesnt have role yet
          setIsAdmin(true); // placeholder 
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
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
    if (!isLoggedIn && (link.link === '/account' || link.link === '/bookshelf' || link.label === 'Find Your NextNovel')) {
      return false; // hide My Account, bookshelf, and recommendation when logged out
    }
    if (isAdmin && isLoggedIn && (link.link === '/bookshelf' ||  link.label === 'Find Your NextNovel')){
      return false; // admin doesn't have bookshelf 
    }
    if (link.admin && !isAdmin){// only show admin dashboard to admins 
      return false;
    }
    return true;
  });

  const items = filteredLinks.map((link) => {

    // drop down when clicking recommendation to choose between ai and questionaire
    if (link.subItems) {
      const isSubActive = link.subItems.some((sub) => location.pathname === sub.link);

      return (
        <Menu key={link.label} trigger="hover" openDelay={100} closeDelay={150} withinPortal>
          <Menu.Target>
            <UnstyledButton
              className={classes.link}
              data-active={isSubActive || undefined}
              style={{display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>{link.label}</span>
              <CaretDown size={14} weight="bold" />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            {link.subItems.map((sub) => (
              <Menu.Item
                key={sub.label}
                component={Link}
                to={sub.link}
                className={classes.link}
                data-active={location.pathname === sub.link || undefined}
              >
                {sub.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
      onClick={close} 
    >
      {link.label}
    </Link>
});

  return (
    <header className={classes.header}>
      <Container fluid p={13} size="lg" className={classes.inner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>

        <Group gap="md">
          <Link to="/">
            <img width={30} src="/nextnovel_fav.png" alt="Logo" />
          </Link>

          <Link to="/search" className={classes.searchLink} style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <MagnifyingGlassIcon size={20} weight="bold" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Search a book title...</span>
          </Link>
        </Group>
        
        
        <Group gap={5} visibleFrom="sm">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} color="#80AA62" size="sm" aria-label="Toggle navigation" hiddenFrom="sm" />
      </Container>
      <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Navigation" hiddenFrom="sm" zIndex={1000000}>
        <ScrollArea h="calc(100vh - 80px)">
          <Divider my="sm" />
          {items}
        </ScrollArea>
      </Drawer>
    </header>
  );
}