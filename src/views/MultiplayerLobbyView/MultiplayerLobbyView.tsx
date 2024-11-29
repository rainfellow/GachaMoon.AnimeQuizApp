import { MultiplayerGamePlayroom } from "@/components/MultiplayerGamePlayroom/MultiplayerGamePlayroom";
import { MultiplayerGamesList } from "@/components/MultiplayerGamesList/MultiplayerGamesList";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { GameState } from "@/models/GameConfiguration";
import { Flex, Group, Loader, Stack, Text } from "@mantine/core";
import { ReactElement, useContext, useEffect } from "react";
import { MultiplayerGame } from "@/components/MultiplayerGame/MultiplayerGame";
import classes from "./MultiplayerLobbyView.module.css"
import { useTranslation } from "react-i18next";

export const MultiplayerLobbyView: React.FC = (): ReactElement => {

    const { gameState, setGameState, gameName } = useContext(MultiplayerGameContext)
    const { connect } = useMultiplayerGame();
    const { t } = useTranslation('game');

    const isInGame = (gameState: GameState) => {
        let a = gameState == GameState.None || gameState == GameState.Connected;
        return !a;
    }


    const ReconnectElement = (gameName: string) => {
        return (
            <Stack align="center">
                <Group justify='center'>
                    <Stack>
                        <Text>{t('ReconnectInProgressText')}</Text>
                        <Text>{gameName}</Text>
                        <Loader/>
                    </Stack>
                </Group>
            </Stack>
        )
    }
    return (
        <div className={classes.fullHeight}>
        {gameState == GameState.Reconnecting && ReconnectElement(gameName)}
        {gameState == GameState.None && <Flex justify="center" align="center"><Loader/></Flex>}
        {gameState == GameState.Connected && <MultiplayerGamesList/>}
        {isInGame(gameState) && <MultiplayerGame/>}
        </div>
    )
}