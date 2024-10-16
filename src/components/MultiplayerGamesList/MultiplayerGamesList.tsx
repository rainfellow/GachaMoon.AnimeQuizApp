import { MultiplayerGameContext } from "@/context/multiplayer-game-context"
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game"
import { GameDetails, GameState, ServerGameState } from "@/models/GameConfiguration"
import { Badge, Button, Card, SimpleGrid, Text, Group, Stack } from "@mantine/core"
import { ReactElement, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export const MultiplayerGamesList: React.FC = (): ReactElement => {
    const { loadActiveGamesList, joinExistingGame, createGame} = useMultiplayerGame()
    const { activeGames, gameState} = useContext(MultiplayerGameContext);
    const [activeGameCards, setActiveGameCards] = useState<JSX.Element[]>();
    const { t } = useTranslation('game');

    const [cardSpan, setCardSpan] = useState(4);

    const gameStatusToColor = (status: ServerGameState) => {
        switch(status) { 
            case ServerGameState.Waiting: { 
                return 'yellow';
            } 
            case ServerGameState.Active: { 
                return 'green';
            } 
            case ServerGameState.Playing: { 
                return 'blue';
            } 
            case ServerGameState.Finished: { 
                return 'red';
            } 
            default: { 
                console.log('failed to get game state')
                return 'black' 
            } 
        } 
    }

    const gameStatusToString = (status: ServerGameState) => {
        switch(status) { 
            case ServerGameState.Waiting: { 
                return 'ServerGameStateWaiting';
            } 
            case ServerGameState.Active: { 
                return 'ServerGameStateActive';
            } 
            case ServerGameState.Playing: { 
                return 'ServerGameStatePlaying';
            } 
            case ServerGameState.Finished: { 
                return 'ServerGameStateFinished';
            } 
            default: { 
                console.log('failed to get game state')
                return 'ServerGameStateError' 
            } 
        } 
    }

    const updateGameCardsList = (gamesList: GameDetails[]) => {
        const list = gamesList.map((game) => 
        <Card shadow="sm" padding="lg" radius="md" withBorder key={game.gameName}>
            <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{game.gameName}</Text>
            <Badge color={gameStatusToColor(game.gameStatus)}>{t(gameStatusToString(game.gameStatus))}</Badge>
            </Group>
    
            <Text>
                {game.currentPlayers} / 4 
            </Text>
    
            <Button disabled={game.gameStatus != ServerGameState.Active} color="blue" fullWidth mt="md" radius="md" onClick={() => joinExistingGame(game.gameName)}>
            {t('GamesListJoinGameButton')}
            </Button>
        </Card>
        )
        setActiveGameCards(list);
    }

    useEffect(() => {
        if (gameState == GameState.Connected)
        {
            loadActiveGamesList();
        }
    }, [gameState]);

    useEffect(() => {
        updateGameCardsList(activeGames);
    }, [activeGames]);

    return (
    <>
    <Stack>
        <Group justify="flex-end">
            <Button size="md" onClick={ () => loadActiveGamesList() }>{t('GamesListRefreshListButton')}</Button>
            <Button size="md" onClick={ () => createGame() }>{t('GamesListCreateGameButton')}</Button>
        </Group>
        <SimpleGrid cols={cardSpan}>
            {gameState == GameState.Connected && activeGameCards != undefined && activeGameCards?.length > 0 && activeGameCards}
        </SimpleGrid>
        {gameState == GameState.Connected && activeGameCards != undefined && activeGameCards?.length == 0 && <Text>{t('GamesListNoGamesFound')}</Text>}
    </Stack>
    </>
    )
}