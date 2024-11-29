import { MultiplayerGameContext } from "@/context/multiplayer-game-context"
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game"
import { GameDetails, GameState, GameType, ServerGameState } from "@/models/GameConfiguration"
import { Badge, Button, Card, SimpleGrid, Text, Group, Stack, LoadingOverlay, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { ReactElement, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export const MultiplayerGamesList: React.FC = (): ReactElement => {
    const { loadActiveGamesList, joinExistingGame, createGame} = useMultiplayerGame()
    const { activeGames, gameState} = useContext(MultiplayerGameContext);
    const [activeGameCards, setActiveGameCards] = useState<JSX.Element[]>();
    const { t } = useTranslation('game');
    const [isLoading, setIsLoading] = useState(false);

    
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

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

    const handleGamesListLoading = () => {
        setIsLoading(true);
        loadActiveGamesList().then(() => setIsLoading(false));
    }

    useEffect(() => {
        if (gameState == GameState.Connected)
        {
            handleGamesListLoading();
        }
    }, [gameState]);

    useEffect(() => {
        updateGameCardsList(activeGames);
    }, [activeGames]);

    return (
    <>
    <Modal opened={modalOpened} onClose={closeModal} title="Authentication" centered w={200} h={350}>
        <SimpleGrid cols={2} spacing='xs'>
            <Stack align='flex-start' flex='grow'>
                <Button onClick={() => createGame(GameType.Standard)}>
                    Standard
                </Button>
            </Stack>
            <Stack align='flex-start' flex='grow'>
                <Button onClick={() => createGame(GameType.Standoff)}>
                    Standoff
                </Button>
            </Stack>
        </SimpleGrid>
    </Modal>
    <Stack>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Group justify="flex-end">
            <Button size="md" onClick={ () => handleGamesListLoading() }>{t('GamesListRefreshListButton')}</Button>
            <Button size="md" onClick={ () => openModal() }>{t('GamesListCreateGameButton')}</Button>
        </Group>
        <SimpleGrid cols={cardSpan}>
            {gameState == GameState.Connected && activeGameCards != undefined && activeGameCards?.length > 0 && activeGameCards}
        </SimpleGrid>
        {gameState == GameState.Connected && activeGameCards != undefined && activeGameCards?.length == 0 && <Text>{t('GamesListNoGamesFound')}</Text>}
    </Stack>
    </>
    )
}