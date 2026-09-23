import { Link, useLocation } from 'react-router-dom';
import { Burger, Container, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.scss';

const links = [
  { link: '/login', label: 'Log In' },
  { link: '/signup', label: 'Register' },
  { link: '/', label: 'Home' },
];

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();

  const items = links.map((link) => (

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
        <img width={30} src="/nextnovel_fav.png" alt="Logo" />
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
