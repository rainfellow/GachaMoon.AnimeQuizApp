import { AuthenticationForm } from '@/forms/AuthenticationForm/AuthenticationForm';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle';
import classes from './Login.module.css';
import { Flex, Stack, UnstyledButton, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className={classes.centerScreen}>
      <Stack>
        <AuthenticationForm />
        <ColorSchemeToggle />
        <Group justify='center'>
          <UnstyledButton onClick={() => navigate('/contact')}>
            <Text size='sm' c="blue">Contact</Text>
          </UnstyledButton>
        </Group>
      </Stack>
    </div>
  );
}
