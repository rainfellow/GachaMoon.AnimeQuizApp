import { Container, Grid, Paper, Stack, Text } from "@mantine/core"
import { ReactElement } from "react"
import classes from "./AccountSettingsView.module.css"

export const AccountSettingsView: React.FC = (): ReactElement => {
    
    return (
        <Paper>
          <Container fluid>
            <Grid gutter={0}>
                <Grid.Col span={{ base: 12, sm: 3, md: 4, lg: 3 }}>
                    <Stack py="md" style={{ height: '100%' }}>
                        <Text>Profile</Text>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9, md: 8, lg: 9 }}>
                    <Stack py="md" style={{ height: '100%' }}>
                        <Text>Profile</Text>
                    </Stack>

                </Grid.Col>
            </Grid>
            </Container>
        </Paper>
    )
}