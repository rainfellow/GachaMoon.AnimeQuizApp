import { MultiplayerGamePlayroom } from "@/components/MultiplayerGamePlayroom/MultiplayerGamePlayroom";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { GameState } from "@/models/GameConfiguration";
import { Grid, Group } from "@mantine/core";
import { ReactElement, useContext, useEffect } from "react";
import { MultiplayerGameSettings } from "../MultiplayerGameSettings/MultiplayerGameSettings";
import classes from "./MultiplayerGame.module.css"
import { GameRecapComponent } from "../GameRecap/GameRecap";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { MultiplayerGameStandoffDeckGame } from "../MultiplayerGameStandoffDeckGame/MultiplayerGameStandoffDeckGame";

export const MultiplayerGame: React.FC = (): ReactElement => {

    const { gameState, gameName, gameRecap, correctAnswers } = useContext(MultiplayerGameContext)

    const { accountIdToName } = useMultiplayerGame();

    const isInSettingsScreen = (gameState: GameState) => {
        return gameState == GameState.Lobby || gameState == GameState.Starting;
    }
    const isInDeckGame = (gameState: GameState) => {
        return gameState == GameState.DeckGame;
    } 
    const isInAnimeSelection = (gameState: GameState) => {
        return gameState == GameState.AnimeSelection;
    }
    return (
        <>
            { isInSettingsScreen(gameState) ? <MultiplayerGameSettings/>
             : isInDeckGame(gameState) ? <MultiplayerGameStandoffDeckGame/>
             : gameState != GameState.Finished ? <MultiplayerGamePlayroom/> : <GameRecapComponent gameName={gameName} gameRecap={gameRecap} correctAnswers={correctAnswers} isMultiplayer={true} findAccountNameById={accountIdToName}/> }
        </>
    )
}