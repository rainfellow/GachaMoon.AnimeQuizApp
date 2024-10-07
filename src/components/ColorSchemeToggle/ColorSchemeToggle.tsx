import { CiDark, CiLight } from 'react-icons/ci';
import { ActionIcon, Group, rem, useMantineColorScheme } from '@mantine/core';
import { useContext } from 'react';
import { LocalSettingsContext } from '@/context/local-settings-context';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const { colorTheme, setColorTheme } = useContext(LocalSettingsContext);

  return (
    <Group justify="center" mt="xl">
      <ActionIcon
        size={42}
        variant="default"
        aria-label="Light"
        onClick={() => { setColorScheme('light'); setColorTheme('light') }}
      >
        <CiLight style={{ width: rem(24), height: rem(24) }} />
      </ActionIcon>
      <ActionIcon
        size={42}
        variant="default"
        aria-label="Dark"
        onClick={() => { setColorScheme('dark'); setColorTheme('dark') }}
      >
        <CiDark style={{ width: rem(24), height: rem(24) }} />
      </ActionIcon>
    </Group>
  );
}
