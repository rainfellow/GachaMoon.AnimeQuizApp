import classes from './Contact.module.css';
import { Stack, Text } from '@mantine/core';

export function ContactPage() {
  return (
    <div className={classes.centerScreen}>
      <Stack>
        <Text>For any copyright or other issues please contact at</Text>
        <Text>admin@gachamoon.xyz</Text>
      </Stack>
    </div>
  );
}
