import { useContext, useState } from 'react';
import { Container, Group, Menu, UnstyledButton, Avatar, rem, Text, useMantineColorScheme, ActionIcon, MenuDivider } from '@mantine/core';
import classes from './MainAppHeader.module.css';
import { AuthContext } from '@/context/auth-context';
import cx from 'clsx';
import {
    CiLogout ,
    CiSettings,
    CiLight,
    CiDark
  } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { LocalSettingsContext } from '@/context/local-settings-context';
import { useTranslation } from 'react-i18next';
import { LanguageConfigButton } from '../LanguageConfigButton/LanguageConfigButton';
const links = [
  { link: '/sololobby', label: 'SoloPlayButtonTitle' },
  { link: '/mplobby', label: 'MultiplayerButtonTitle' },
  { link: '/customization', label: 'CustomizeButtonTitle' },
  { link: '/animebase', label: 'AnimeBaseButtonTitle' },
];

export function MainAppHeader() {
  const { accountInfo } = useContext(AuthContext);

  const { logout } = useAuth();
  const [active, setActive] = useState("");
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { setColorScheme } = useMantineColorScheme();
  const { colorTheme, setColorTheme } = useContext(LocalSettingsContext);
  const { t } = useTranslation('header'); 

  const navigate = useNavigate()

  const handleSettingsButtonClick = () => {
    navigate('/account');
  }

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        navigate(link.link);
      }}
    >
      {t(link.label)}
    </a>
  ));

  return (
      <Container size="xl" className={classes.inner}>
        <Group gap={5} visibleFrom="xs" justify='flex-start'>
          {items}
        </Group>
        <Group gap={5} visibleFrom="xs" justify='flex-end'>
            <LanguageConfigButton/>
            <ActionIcon
                onClick={() => { setColorScheme(colorTheme === 'light' ? 'dark' : 'light'); setColorTheme(colorTheme === 'light' ? 'dark' : 'light')}}
                variant="default"
                size="md"
                aria-label="Toggle color scheme"
            >
                {colorTheme === 'light' ? <CiLight className={cx(classes.icon, classes.light)}  /> : <CiDark className={cx(classes.icon, classes.dark)} />}
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
                    <CiSettings style={{ width: rem(16), height: rem(16) }} />
                    }
                    onClick={handleSettingsButtonClick}
                >
                    {t('SettingsMenuButtonTitle')}
                </Menu.Item>
                <MenuDivider/>
                <Menu.Item
                    leftSection={
                    <CiLogout style={{ width: rem(16), height: rem(16) }} />
                    }
                    onClick={logout}
                >
                    {t('LogoutMenuButtonTitle')}
                </Menu.Item>
                </Menu.Dropdown>
            </Menu>
          </Group>
      </Container>
  );
}