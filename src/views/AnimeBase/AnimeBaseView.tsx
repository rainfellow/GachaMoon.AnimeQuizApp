import { Container, Paper } from "@mantine/core"
import { ReactElement, useState } from "react"
import classes from "./AnimeBaseView.module.css"
import { AnimeBaseTable } from "@/components/AnimeBaseTable/AnimeBaseTable";

export const AnimeBaseView: React.FC = (): ReactElement => {
    return (
        <Paper>
        <Container fluid className={classes.wrapper}>
            <AnimeBaseTable/>
            </Container>
        </Paper>
    )
}