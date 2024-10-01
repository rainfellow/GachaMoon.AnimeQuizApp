import { useContext, useState } from 'react';
import { Container, Group, Burger, Menu, UnstyledButton, Avatar, rem, Text, useMantineColorScheme, useComputedColorScheme, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './MainAppHeader.module.css';
import { AuthContext } from '@/context/auth-context';
import cx from 'clsx';
import {
    CiLogout ,
    CiLight,
    CiDark
  } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
const links = [
  { link: '/sololobby', label: 'Solo Play' },
  { link: '/mplobby', label: 'Multiplayer' },
  { link: '/customization', label: 'Customize' },
];

export function MainAppHeader() {
  const { accountInfo } = useContext(AuthContext);

  const [opened, { toggle }] = useDisclosure(false);
  const { logout } = useAuth();
  const [active, setActive] = useState("");
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const navigate = useNavigate()

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        //event.preventDefault();
        setActive(link.link);
        //navigate(active);
      }}
    >
      {link.label}
    </a>
  ));

  return (
      <Container size="xl" className={classes.inner}>
        <Group gap={5} visibleFrom="xs" justify='flex-start'>
          {items}
        </Group>
        <Group gap={5} visibleFrom="xs" justify='flex-end'>
            <ActionIcon
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
            >
                {computedColorScheme === 'light' ? <CiLight className={cx(classes.icon, classes.light)}  /> : <CiDark className={cx(classes.icon, classes.dark)} />}
            </ActionIcon>
            <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
            >
                <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                    <Group gap={7}>
                    <Avatar src={ null } alt={accountInfo?.accountName} radius="xl" size={20} />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                        {accountInfo?.accountName}
                    </Text>
                    <FaChevronDown style={{ width: rem(12), height: rem(12) }}/>
                    </Group>
                </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                <Menu.Item
                    leftSection={
                    <CiLogout style={{ width: rem(16), height: rem(16) }} />
                    }
                    onClick={logout}
                >
                    Logout
                </Menu.Item>
                </Menu.Dropdown>
            </Menu>
          </Group>
      </Container>
  );
}