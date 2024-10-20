import { MultiplayerGamePlayroom } from "@/components/MultiplayerGamePlayroom/MultiplayerGamePlayroom";
import { MultiplayerGameChat } from "@/components/MultiplayerGameChat/MultiplayerGameChat";
import { MultiplayerGamesList } from "@/components/MultiplayerGamesList/MultiplayerGamesList";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { GameState } from "@/models/GameConfiguration";
import { Flex, Group, Loader } from "@mantine/core";
import { ReactElement, useContext, useEffect } from "react";
import { MultiplayerGame } from "@/components/MultiplayerGame/MultiplayerGame";
import classes from "./MultiplayerLobbyView.module.css"

export const MultiplayerLobbyView: React.FC = (): ReactElement => {

    const { gameState, setGameState } = useContext(MultiplayerGameContext)
    const { connect } = useMultiplayerGame();

    const isInGame = (gameState: GameState) => {
        let a = gameState == GameState.None || gameState == GameState.Connected;
        return !a;
    }

    useEffect(() => {
        if(gameState == GameState.None) {
            connect();
        }
    }, [gameState])
    return (
        <div className={classes.fullHeight}>
        {gameState == GameState.None && <Flex justify="center" align="center"><Loader/></Flex>}
        {gameState == GameState.Connected && <MultiplayerGamesList/>}
        {isInGame(gameState) && <MultiplayerGame/>}
        </div>
    )
}