import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { DiscordButton } from '@/components/DiscordButton';
import { GoogleButton } from '@/components/GoogleButton';
import classes from './AuthernticationForm.module.css';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const redirectToDiscord = () => 
  {
      window.location.href = `https://discord.com/oauth2/authorize?client_id=1222238485134442556&response_type=code&redirect_uri=https%3A%2F%2Fgachamoon.xyz%2Fauth%2Fdiscord&scope=identify`; 
  }
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string | any[]) =>
        val.length <= 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  return (
    <div className={classes.wrapper}>
      <Paper radius="md" p="xl" className={classes.form} withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to GachaMoon, login with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <DiscordButton radius="xl" onClick={redirectToDiscord}>Discord</DiscordButton>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => {})}>
          <Stack >
            <TextInput
              required
              label="Email"
              placeholder="Your email"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />
          </Stack>      
            <Button justify="space-between" mt="xl" type="submit" radius="xl">
              Login
            </Button>
        </form>
      </Paper>
    </div>
  );
}
