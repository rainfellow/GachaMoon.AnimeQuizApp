import { MultiplayerGamePlayroom } from "@/components/MultiplayerGamePlayroom/MultiplayerGamePlayroom";
import { MultiplayerGameChat } from "@/components/MultiplayerGameChat/MultiplayerGameChat";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { GameState } from "@/models/GameConfiguration";
import { Grid, Group } from "@mantine/core";
import { ReactElement, useContext, useEffect } from "react";
import { MultiplayerGameSettings } from "../MultiplayerGameSettings/MultiplayerGameSettings";
import classes from "./MultiplayerGame.module.css"
import { GameRecapComponent } from "../GameRecap/GameRecap";

export const MultiplayerGame: React.FC = (): ReactElement => {

    const { gameState, gameName, gameRecap, correctAnswers } = useContext(MultiplayerGameContext)

    const isInSettingsScreen = (gameState: GameState) => {
        return gameState == GameState.Lobby || gameState == GameState.Starting;
    }
    return (
        <Grid justify="space-between" classNames={{ root: classes.fullHeight, inner: classes.fullHeight}}>
            <Grid.Col span="auto">
            { isInSettingsScreen(gameState) ? <MultiplayerGameSettings/>
             : gameState != GameState.Finished ? <MultiplayerGamePlayroom/> : <GameRecapComponent gameName={gameName} gameRecap={gameRecap} correctAnswers={correctAnswers} isMultiplayer={true} /> }
            </Grid.Col>
            
            <Grid.Col span={2} className={classes.chatWindow}>
                <MultiplayerGameChat/>
            </Grid.Col>
        </Grid>
    )
}