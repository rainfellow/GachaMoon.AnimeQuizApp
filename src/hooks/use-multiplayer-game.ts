import { useContext } from "react";
import { SoloGameContext } from "../context/solo-game-context";
import { useAuth } from "./use-auth";
import MultiplayerHubConnector from '../signalr-mphub'
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameDetails, GameJoinResult, GameQuestion, GameState, PlayerAnswer, PlayerInfo, QuestionResult } from "../models/GameConfiguration";
import { AnimeContext } from "@/context/anime-context";
import { useAnimeBase } from "./use-anime-base";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/context/auth-context";

export interface IMultiplayerGame {
    connect: () => Promise<void>;
    createGame: () => Promise<void>;
    answerQuestion: (answer: GameAnswer) => void;
    joinExistingGame: (gameName: string) => Promise<void>
    loadActiveGamesList: () => Promise<void>
    setReadyStatus: (status: boolean) => Promise<void>
    updateGameSettings: (gameConfiguration: GameConfiguration) => Promise<void>
    sendChatMessage: (message: string) => Promise<void>
    accountIdToName: (accountId: number) => string
    leaveCurrentGame: () => Promise<void>
}

export const useMultiplayerGame = (): IMultiplayerGame => {
    const { account, accountInfo } = useContext(AuthContext);
    const { events, setGameSettings, setQuestionAnswered, setReadyForGame, getGameName, connectToLobby,
        createNewGame, joinGame, leaveGame, sendMessage, getActiveGames, reconnectToGame } = MultiplayerHubConnector(account == null ? "" : account.token);
    const { isReady, setIsReady, gameState, setGameState,
      currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, 
      gameConfiguration, setGameConfiguration, lastAnswerData, setLastAnswerData, gameRecap, setGameRecap, gameName, setGameName, 
      setQuestionNumber, setQuestionTimeout, setDiversifyAnime, setAnimeAllowedYears, setAnimeAllowedRating,
      setChatLog, updateChatLog, chatLog, isLobbyLeader, setIsLobbyLeader,
      activeGames, setActiveGames, playerAnswers, setPlayerAnswers, currentGamePlayers, setCurrentGamePlayers, addPlayerToList } = useContext(MultiplayerGameContext);
    const { animeLoaded, animes } = useContext(AnimeContext);
    const { loadAnimes } = useAnimeBase();
    const { t } = useTranslation('game');

    
    const handleMessageReceived = (newMessage: string, senderId: number) => {
        console.log('message received: ' + newMessage);
        updateChatLog({accountId: senderId, message: newMessage});
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
        updateChatLog({accountId: 0, message: "player " + playerInfo.accountName + " joined"});
        addPlayerToList(playerInfo);

    }

    const handlePlayerLeft = (accountId: number) => {
        updateChatLog({accountId: 0, message: "player " + accountId + " left"});
    }

    const handlePlayerDisconnected = (accountId: number) => {
        updateChatLog({accountId: 0, message: "player " + accountId + " lost connection"});
    }

    const handlePlayerReconnected = (accountId: number) => {
        updateChatLog({accountId: 0, message: "player " + accountId + " reconnected"});
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
    const handleGameCompleted = (event: GameCompletedEvent) => {
        setGameState(GameState.Finished)
        setIsReady(true);
        //setCurrentQuestion(defaultQuestion);
        //setCurrentAnswer(defaultAnswer);
        setCorrectAnswers(event.correct);
        setGameRecap(event.gameRecap);
    }
    events(handleMessageReceived, handleAskQuestion, handleConfirmAnswerReceived, handleGameConfigurationUpdated, handlePlayerJoined, handlePlayerLeft, handlePlayerDisconnected, handlePlayerReconnected, handleQuestionResultReceived, handleQuestionTransitionMessage, handleGameStarted, handleGameCompleted );

    const loadAnime = async () => {
        if(!animeLoaded)
        {
          await loadAnimes();
        }
    }

    const connect = async () => {
        setActiveGames([]);
        await loadAnime().then(() => { 
            connectToLobby()?.catch(() => {
                console.log("error while creating lobby")
            }).then(async (result) => { 
                if (result == null || result == undefined)
                {
                    console.log('connected to lobby')
                    setGameState(GameState.Connected);
                }
                else
                {
                    console.log('reconnecting to ' + result)
                    setGameState(GameState.Reconnecting);
                    let game = await reconnectToGame(result);
                    if (game.isSuccessful) { 
                        console.log("game created"); 
                        setGameState(GameState.Lobby);
                        setIsLobbyLeader(false);
                        setCurrentGamePlayers(game.players);
                        setGameConfiguration(game.gameConfiguration);
                    } 
                    else {
                        console.log("error while rejoining game"); 
                    }
                }
            }); 
        });
    };

    const createGame = async () => {        
        createNewGame()
            .then((success: boolean) => {
                if (success) { 
                    setGameState(GameState.Lobby)
                    setCurrentGamePlayers([{accountId: account!.accountId, accountName: accountInfo!.accountName}])
                    setIsLobbyLeader(true);
                } 
                else {
                    console.log("error while starting game"); 
                }
                    
                return success;
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

    const sendChatMessage = async (message: string) => {
        await sendMessage(message);
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

    return { connect, createGame, joinExistingGame, answerQuestion, loadActiveGamesList, setReadyStatus, updateGameSettings, sendChatMessage, accountIdToName, leaveCurrentGame };
};
