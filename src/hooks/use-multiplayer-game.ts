import { useContext } from "react";
import { SoloGameContext } from "../context/solo-game-context";
import { useAuth } from "./use-auth";
import MultiplayerHubConnector from '../signalr-mphub'
import { Chat, ChatData, GameAnswer, GameCompletedEvent, GameConfiguration, GameDetails, GameJoinResult, GameQuestion, GameState, GameType, LobbyStatus, PlayerAnswer, PlayerInfo, QuestionResult, ServerGameState, StandoffAnimeSelection, StandoffAnimeSelectionResult, StandoffDeckState } from "../models/GameConfiguration";
import { AnimeContext } from "@/context/anime-context";
import { useAnimeBase } from "./use-anime-base";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/context/auth-context";
import { GameConfigurationContext } from "@/context/game-configuration-context";
import { ChatsContext } from "@/context/chats-context";

export interface IMultiplayerGame {
    connect: () => Promise<void>;
    createGame: (gameType: GameType) => Promise<void>;
    answerQuestion: (answer: GameAnswer) => void;
    joinExistingGame: (gameName: string) => Promise<void>
    loadActiveGamesList: () => Promise<void>
    setReadyStatus: (status: boolean) => Promise<void>
    updateGameSettings: (gameConfiguration: GameConfiguration) => Promise<void>
    sendChatMessage: (chatName: string, message: string) => Promise<void>
    accountIdToName: (accountId: number) => string
    leaveCurrentGame: () => Promise<void>
    startNewChat: (invitedAccountId: number) => Promise<Chat>
    drawCard: () => Promise<StandoffDeckState>
    discardCard: (cardId: string) => Promise<StandoffDeckState>
    confirmSelection: (selectionResults: StandoffAnimeSelectionResult[]) => Promise<boolean>
}

export const useMultiplayerGame = (): IMultiplayerGame => {
    const { account, accountInfo } = useContext(AuthContext);
    const { events, setGameSettings, setQuestionAnswered, setReadyForGame, getGameName, connectToLobby,
        createNewGame, joinGame, leaveGame, sendMessage, getActiveGames, reconnectToGame, createChat, standoffDrawCard, standoffDiscardCard, confirmSelection: standoffConfirmSelection } = MultiplayerHubConnector(account == null ? "" : account.token);
    const { isReady, setIsReady, gameState, setGameState,
      currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, 
      lastAnswerData, setLastAnswerData, gameRecap, setGameRecap, gameName, setGameName, 
      isLobbyLeader, setIsLobbyLeader,
      activeGames, setActiveGames, playerAnswers, setPlayerAnswers, currentGamePlayers, setCurrentGamePlayers, setDeckState, setSelectionData, addPlayerToList } = useContext(MultiplayerGameContext);
    const { gameConfiguration, setGameConfiguration } = useContext(GameConfigurationContext);
    const { chats, addChat, addMessage, removeChat, cachedPlayers, addCachedPlayers } = useContext(ChatsContext);
    const { animeLoaded, animes } = useContext(AnimeContext);
    const { loadAnimes, loadUserAnimeList } = useAnimeBase();
    const { t } = useTranslation('game');

    
    const handleMessageReceived = (chatName: string, newMessage: string, senderId: number) => {
        console.log('message received: ' + newMessage);
        addMessage(chatName, {accountId: senderId, message: newMessage});
    }

    const handleAskQuestion = (question: GameQuestion) => {
        setGameState(GameState.QuestionReceived)
        setCurrentQuestion(question);
    }

    const handleConfirmAnswerReceived = () => {
        setGameState(GameState.AnswerReceived)
    }

    const handleGameConfigurationUpdated = (gameConfiguration: GameConfiguration) => {
        console.log('game config received!');
        setGameConfiguration(gameConfiguration);
    }

    const handlePlayerJoined = (playerInfo: PlayerInfo) => {
        console.log('player joined!');
        addMessage(getGameName() ?? "error", {accountId: 0, message: "player " + playerInfo.accountName + " joined"});
        addPlayerToList(playerInfo);
        addCachedPlayers([playerInfo])

    }

    const handlePlayerLeft = (accountId: number) => {
        addMessage(getGameName() ?? "error", {accountId: 0, message: "player " + accountId + " left"});
    }

    const handlePlayerDisconnected = (accountId: number) => {
        addMessage(getGameName() ?? "error", {accountId: 0, message: "player " + accountId + " lost connection"});
    }

    const handlePlayerReconnected = (accountId: number) => {
        addMessage(getGameName() ?? "error", {accountId: 0, message: "player " + accountId + " reconnected"});
    }

    const handleQuestionResultReceived = (questionResult: QuestionResult) => {
        setGameState(GameState.QuestionTransition)
        setLastAnswerData(questionResult)
        if (questionResult.isCorrect)
        {
            setCorrectAnswers(correctAnswers + 1);
        }
    }
    const handleQuestionTransitionMessage = (playerAnswers: PlayerAnswer[]) => {
       setPlayerAnswers(playerAnswers);
    }
    const handleGameStarted = (gameConfiguration: GameConfiguration) => {
        setGameConfiguration(gameConfiguration)
        setCorrectAnswers(0);
        setPlayerAnswers(currentGamePlayers.map((player) => {
            let a: PlayerAnswer = { accountId: player.accountId, isCorrect: true, totalCorrect: 0, answer: 0 }
            return a;
        }))
        setGameState(GameState.Started)
        if(getGameName == undefined)
        {
            console.log('error. game name was undefined')
        }
        setGameName(getGameName() ?? "");
    }
    const handleDeckGameStarted = (playerDeckState: StandoffDeckState) => {
        setDeckState(playerDeckState);
        setGameState(GameState.DeckGame);
    }
    const handleSelectionStarted = (selectionData: StandoffAnimeSelection[]) => {
        setSelectionData(selectionData);
        setGameState(GameState.AnimeSelection);
        //todo
    }
    const handleGameCompleted = (event: GameCompletedEvent) => {
        setGameState(GameState.Finished)
        setIsReady(true);
        //setCurrentQuestion(defaultQuestion);
        //setCurrentAnswer(defaultAnswer);
        setCorrectAnswers(event.correct);
        setGameRecap(event.gameRecap);
    }

    events(handleMessageReceived, handleAskQuestion, handleConfirmAnswerReceived, handleGameConfigurationUpdated, handlePlayerJoined, handlePlayerLeft, handlePlayerDisconnected, handlePlayerReconnected, handleQuestionResultReceived, handleQuestionTransitionMessage, handleGameStarted, handleGameCompleted, handleDeckGameStarted, handleSelectionStarted);

    const loadAnime = async () => {
        if(!animeLoaded)
        {
          await loadAnimes();
          await loadUserAnimeList();
        }
    }

    const connect = async () => {
        setActiveGames([]);
        await loadAnime().then(() => { 
            connectToLobby()?.catch(() => {
                console.log("error while creating lobby")
            }).then(async (result) => { 
                if (result == undefined)
                {
                    console.log('lobby undefined result');
                    return;
                }
                if (result.chats != null)
                {
                    result.chats.forEach(chat => {
                        addChat(chat.name, { members: chat.members, isArchived: chat.isArchived, chatType: chat.type, messages: chat.messages, messageCount: chat.messages.length, name: chat.name });
                    });
                }
                if (result.status == LobbyStatus.Idle || result.status == LobbyStatus.None)
                {
                    console.log('connected to lobby')
                    setGameState(GameState.Connected);
                }
                else
                {
                    console.log('reconnecting to ' + result)
                    setGameState(GameState.Reconnecting);
                    let game = await reconnectToGame(result.gameName!);
                    if (game.isSuccessful) { 
                        console.log("reconnected"); 
                        setIsLobbyLeader(false);
                        setCurrentGamePlayers(game.players);
                        addCachedPlayers(game.players);
                        setGameConfiguration(game.gameConfiguration);
                        if (game.gameStatus == ServerGameState.Playing)
                        {
                            setPlayerAnswers(game.playerAnswers);
                            setGameState(GameState.QuestionTransition);
                        }
                        else
                        {
                            setGameState(GameState.Lobby);
                        }
                        setGameName(game.gameName);
                        setPlayerAnswers(game.playerAnswers);
                        addChat(game.gameChat.name, { 
                            members: game.gameChat.members, 
                            isArchived: game.gameChat.isArchived, 
                            chatType: game.gameChat.type, 
                            messages: game.gameChat.messages, 
                            messageCount: game.gameChat.messages.length, 
                            name: game.gameChat.name 
                        });
                    } 
                    else {
                        console.log("error while rejoining game"); 
                    }
                }
            }); 
        });
    };

    const createGame = async (gameType: GameType) => {        
        createNewGame(gameType)
            .then((result: GameJoinResult) => {
                if (result.isSuccessful) { 
                    setGameState(GameState.Lobby)
                    setCurrentGamePlayers([{accountId: account!.accountId, accountName: accountInfo!.accountName}])
                    addCachedPlayers([{accountId: account!.accountId, accountName: accountInfo!.accountName}])
                    setIsLobbyLeader(true);
                    setGameName(result.gameName);
                    addChat(result.gameChat.name, { 
                        members: result.gameChat.members, 
                        isArchived: result.gameChat.isArchived, 
                        chatType: result.gameChat.type, 
                        messages: result.gameChat.messages, 
                        messageCount: result.gameChat.messages.length, 
                        name: result.gameChat.name 
                    });
                } 
                else {
                    console.log("error while starting game"); 
                }
                    
                return result.isSuccessful;
            })
            .catch(() => {
                console.log("error while starting game")
            });
    };

    const joinExistingGame = async (gameName: string) => {        
        joinGame(gameName)
            .then((result: GameJoinResult) => {
                if (result.isSuccessful) { 
                    console.log("game created"); 
                    setGameState(GameState.Lobby);
                    setIsLobbyLeader(false);
                    setCurrentGamePlayers(result.players);
                    setGameName(result.gameName);
                    addChat(result.gameChat.name, { 
                        members: result.gameChat.members, 
                        isArchived: result.gameChat.isArchived, 
                        chatType: result.gameChat.type, 
                        messages: result.gameChat.messages, 
                        messageCount: result.gameChat.messages.length, 
                        name: result.gameChat.name 
                    });
                    setGameConfiguration(result.gameConfiguration);
                } 
                else {
                    console.log("error while joining game"); 
                }
            })
            .catch(() => {
                console.log("error while joining game")
            });
    };

    const loadActiveGamesList = async () => {
        getActiveGames().then((games) => setActiveGames(games));
    }

    const setReadyStatus = async (status: boolean) => {
        await setReadyForGame(status);
    }

    const updateGameSettings = async (gameConfiguration: GameConfiguration) => {
        await setGameSettings(gameConfiguration);
    }

    const sendChatMessage = async (chatName: string, message: string) => {
        await sendMessage(chatName, message);
    }

    const answerQuestion = (answer: GameAnswer) => {
        
        setQuestionAnswered(answer);
        setGameState(GameState.QuestionAnswered)
    }

    const accountIdToName = (accountId: number) => {
        if (accountId == 0)
        {
            return t('GameChatSystemMessage');
        }
        else
        {
            return currentGamePlayers.find(x => x.accountId == accountId)!.accountName;
        }
    }

    const leaveCurrentGame = () => {
        return leaveGame().then((x: boolean) => 
        {
            if (x) {
                console.log('left game');
                setGameState(GameState.None);
            }
            else {
                console.log('failed to leave game');
            }
        })
    }

    const startNewChat = (invitedAccountId: number) => {
        return createChat([invitedAccountId]).then((chat: ChatData) => {
            let newChat = { members: chat.members, isArchived: chat.isArchived, chatType: chat.type, messages: chat.messages, messageCount: chat.messages.length, name: chat.name }
            addChat(chat.name, newChat);
            return newChat});
    }

    const drawCard = () => {
        return standoffDrawCard().then((result: StandoffDeckState) => {setDeckState(result); console.log('drew a card'); return result; });
    }

    const discardCard = (cardId: string) => {
        return standoffDiscardCard(cardId).then((result: StandoffDeckState) => {setDeckState(result); console.log('drew a card'); return result; });
    }

    const confirmSelection = (selectionResults: StandoffAnimeSelectionResult[]) => {
        return standoffConfirmSelection(selectionResults);
    }

    return { connect, createGame, joinExistingGame, answerQuestion, loadActiveGamesList, setReadyStatus, updateGameSettings, sendChatMessage, accountIdToName, leaveCurrentGame, startNewChat, drawCard, discardCard, confirmSelection };
};
