import { Container, Divider, Flex, Group, Paper, rem, Stack, Text } from "@mantine/core"
import { ReactElement, useState } from "react"
import { CgProfile, CgList } from "react-icons/cg";
import classes from "./AnimeBaseView.module.css"
import AnimeListsConfiguration from "@/components/AnimeLists/AnimeListsConfiguration";
import ProfileSettings from "@/components/ProfileSettings/ProfileSettings";
import { AnimeBaseTable } from "@/components/AnimeBaseTable/AnimeBaseTable";
import { AnimeContext, AnimeContextProvider } from "@/context/anime-context";

export const AnimeBaseView: React.FC = (): ReactElement => {
    return (
        <AnimeContextProvider>
            <Paper>
            <Container fluid className={classes.wrapper}>
                <AnimeBaseTable/>
                </Container>
            </Paper>
        </AnimeContextProvider>
    )
}