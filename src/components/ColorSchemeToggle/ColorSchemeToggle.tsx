import { CiDark, CiLight } from 'react-icons/ci';
import { ActionIcon, Group, rem, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center" mt="xl">
      <ActionIcon
        size={42}
        variant="default"
        aria-label="ActionIcon with size as a number"
        onClick={() => setColorScheme('light')}
      >
        <CiLight style={{ width: rem(24), height: rem(24) }} />
      </ActionIcon>
      <ActionIcon
        size={42}
        variant="default"
        aria-label="ActionIcon with size as a number"
        onClick={() => setColorScheme('dark')}
      >
        <CiDark style={{ width: rem(24), height: rem(24) }} />
      </ActionIcon>
    </Group>
  );
}
