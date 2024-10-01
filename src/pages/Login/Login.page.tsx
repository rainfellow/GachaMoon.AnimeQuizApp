import { AuthenticationForm } from '@/forms/AuthenticationForm/AuthenticationForm';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle';
import classes from './Login.module.css';
import { Stack } from '@mantine/core';

export function LoginPage() {
  return (
    <div className={classes.centerScreen}>
      <Stack>
        <AuthenticationForm />
        <ColorSchemeToggle />
      </Stack>
    </div>
  );
}
