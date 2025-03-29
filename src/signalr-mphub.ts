import * as signalR from "@microsoft/signalr";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameDetails, GameJoinResult, GameQuestion, GameRejoinResult, GameType, LobbyStatus, PlayerAnswer, PlayerInfo, PlayerLobbyStatus, QuestionResult, StandoffAnimeSelection, StandoffAnimeSelectionResult, StandoffDeckState } from "./models/GameConfiguration";
import { EventCard, LifeGameMoveResult, LifeGameState, MoveOption } from "./models/LifeGame";
const URL = "https://game.gachamoon.xyz/mplobby";
class MultiplayerHubConnector {
    private connection: signalR.HubConnection;
    private isConnected: boolean = false;
    private isReadyForGame: boolean = false;
    private isLobbyLeader: boolean = false;
    private isQuestionAnswered: boolean = false;
    private answer: GameAnswer = { choice: undefined, customChoice: undefined};
    private currentGameName: string | undefined = undefined
    private answerWaitingInterval: NodeJS.Timeout | undefined = undefined;
    private updateSettingsTimeout: NodeJS.Timeout | undefined = undefined;

    public events: ((
        onMessageReceived: (chatName: string, message: string, accountId: number) => void,
        onAskQuestion: (question: GameQuestion) => void,
        onConfirmAnswerReceived: () => void,
        onGameConfigurationUpdated: (gameConfiguration: GameConfiguration) => void,
        onPlayerJoined: (playerInfo: PlayerInfo) => void,
        onPlayerLeft: (accountId: number) => void,
        onPlayerDisconnected: (accountId: number) => void,
        onPlayerReconnected: (accountId: number) => void,
        onSendQuestionResult: (questionResult: QuestionResult) => void,
        onSendQuestionTransitionMessage: (playerAnswers: PlayerAnswer[]) => void,
        onGameStarted: (gameConfiguration: GameConfiguration) => void,
        onGameCompleted: (event: GameCompletedEvent) => void,
        onDeckGameStarted: (playerDeckState: StandoffDeckState) => void,
        onSelectionStarted: (selectionData: StandoffAnimeSelection[]) => void,
        onLifeGameStarted: (lifeGameState: LifeGameState) => void,
        onLifeGameSecondPartStarted: (lifeGameState: LifeGameState) => void,
        onLifeGameThirdPartStarted: (lifeGameState: LifeGameState) => void,
        onLifeGameOtherPlayerMoved: (playerId: number, newPosition: number) => void,
    ) => void);

    static instance: MultiplayerHubConnector;
    constructor(authToken: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                accessTokenFactory: () => authToken,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
              })
            .withAutomaticReconnect()
            .build();
        this.events = (onMessageReceived, onAskQuestion, onConfirmAnswerReceived, onGameConfigurationUpdated, onPlayerJoined, onPlayerLeft, onPlayerDisconnected, onPlayerReconnected,
            onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted, onDeckGameStarted, onSelectionStarted,
            onLifeGameStarted, onLifeGameSecondPartStarted, onLifeGameThirdPartStarted, onLifeGameOtherPlayerMoved) => {}
        this.startConnection();
        
    }

    public connectToLobby = async () => {
        return this.connection.invoke("ConnectToLobby").then((x: PlayerLobbyStatus) => {
            this.resetGameStates();
            if (x.status == LobbyStatus.HasActiveGame)
            {
                console.log("connected to lobby while having an active game. reconnecting! game: " + x.gameName);
            }
            return x;
        })
    }

    public createNewGame = async (gameType: GameType) => {
        return this.connection.invoke("CreateGame", gameType).then((x: GameJoinResult) => {
            if (x != null && x.isSuccessful)
            {
                this.currentGameName = x.gameName;
                this.isLobbyLeader = true;
                return x;
            }
            else
            {
                console.log("failed to create new game");
                return x;
            }
        })

    }
    
    public setGameSettings = (gameConfiguration: GameConfiguration) => {
        clearTimeout(this.updateSettingsTimeout);
        this.updateSettingsTimeout = setTimeout(() => {
            return this.connection.invoke("SetGameOptions", gameConfiguration).then(x => x === true ? console.log("successfully changed game settings") : console.log("error while changing game settings " + x))
    }, 1000);
        
    }

    public setReadyForGame = async (readyStatus: boolean) =>
    {
        this.isReadyForGame = await this.connection.invoke("SetReady", readyStatus).then(x => x === true ? x : false);
    }

    public getActiveGames = async () => {
        return this.connection.invoke("GetActiveGames").then((x: GameDetails[]) => { console.log('fetched games: ' + x.length); return x });
    }

    public setQuestionAnswered = (answer: GameAnswer) =>
    {
        this.answer = answer;
        this.isQuestionAnswered = true;
    }

    public getConnectionStatus = () =>
    {
        return this.isConnected;
    }

    public sendMessage = async (chatName: string, message: string) => {
        return this.connection.invoke("SendMessage", chatName, message).then((x: boolean) => { return x });
        
    }

    public joinGame = async (gameName: string) => {
        return this.connection.invoke("TryJoinGame", gameName).then((x: GameJoinResult) => { 
            if (x.isSuccessful)
            {
                console.log('joined game ' + gameName); 
                this.currentGameName = gameName;
            }
            else
            {
                console.log('failed to join game ' + gameName); 
            }
            return x;
        });
    }

    public leaveGame = async () => {
        return this.connection.invoke("TryLeaveGame").then((x: boolean) => { 
            if (x)
            {
                console.log('left game ' + this.currentGameName); 
                this.resetGameStates();
            }
            else
            {
                console.log('failed to leave game ' + this.currentGameName); 
            }
            return x;
        });
    }

    public reconnectToGame = async (gameName: string) => {
        return this.connection.invoke("TryRejoinGame", gameName).then((x: GameRejoinResult) => { 
            if (x.isSuccessful)
            {
                console.log('rejoined game ' + gameName); 
                this.currentGameName = gameName;
            }
            else
            {
                console.log('failed to join game ' + gameName); 
            }
            return x;
        });
    }

    public createChat = async (invitedIds: number[]) => {
        return this.connection.invoke("CreateChat", invitedIds);
    }

    public standoffDrawCard = async () => {
        return this.connection.invoke("StandoffDrawCard").then((x: StandoffDeckState) => {
            if (!x.moveSuccessful)
            {
                console.log('error while drawing a card')
            }
            return x;
        });
    }

    public standoffDiscardCard = async (cardId: string) => {
        return this.connection.invoke("StandoffDiscardCard", cardId).then((x: StandoffDeckState) => {
            if (!x.moveSuccessful)
            {
                console.log('error while discarding a card')
            }
            return x;
        });
    }

    public confirmSelection = async (selectionResults: StandoffAnimeSelectionResult[]) => {
        return this.connection.invoke("StandoffConfirmSelection", selectionResults).then((x: boolean) => {
            if (!x)
            {
                console.log('error while confirming selected anime')
            }
            return x;
        });
    }

    public getGameName = () =>
    {
        return this.currentGameName;
    }

    public getLobbyLeaderStatus = () => {
        return this.isLobbyLeader;
    }

    public lifeGameAttemptMove = async (moveOption: MoveOption) => {
        return this.connection.invoke("LifeGameMove", moveOption).then((x: LifeGameMoveResult) => {
            if (!x.isSuccessful)
            {
                console.log('error while confirming selected anime')
            }
            return x;
        });
    }

    public static getInstance(authToken: string): MultiplayerHubConnector {
        if (!MultiplayerHubConnector.instance)
            MultiplayerHubConnector.instance = new MultiplayerHubConnector(authToken);
        return MultiplayerHubConnector.instance;
    }

    private resetGameStates = () => {
        this.currentGameName = "";
        this.isQuestionAnswered = false;
        this.answer = { choice: undefined, customChoice: undefined};
        this.isReadyForGame = false;
        this.isLobbyLeader = false;
    }

    private startConnection = () => {
        this.connection.start().then(
            () => {
                this.events = (onMessageReceived, onAskQuestion, onConfirmAnswerReceived, onGameConfigurationUpdated, onPlayerJoined, onPlayerLeft, onPlayerDisconnected, onPlayerReconnected,
                    onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted, onDeckGameStarted, onSelectionStarted, onLifeGameStarted, onLifeGameSecondPartStarted, onLifeGameThirdPartStarted, onLifeGameOtherPlayerMoved) => {
                    this.connection.off("MessageReceived");
                    this.connection.off("AskQuestion");
                    this.connection.off("ConfirmAnswerReceived");
                    this.connection.off("GameConfigurationUpdated");
                    this.connection.off("PlayerJoined");
                    this.connection.off("PlayerLeft");
                    this.connection.off("SendQuestionResult");
                    this.connection.off("SendQuestionTransitionMessage");
                    this.connection.off("GameStarted");
                    this.connection.off("GameCompleted");
                    this.connection.off("DeckGameStarted");
                    this.connection.off("SelectionStarted");
                    this.connection.off("LifeGameStarted");
                    this.connection.off("LifeGameSecondPartStarted");
                    this.connection.off("LifeGameThirdPartStarted");
                    this.connection.off("LifeGameOtherPlayerMoved");
                    this.connection.on("MessageReceived", (chatName: string, message: string, accountId: number) => {
                        onMessageReceived(chatName, message, accountId);
                    });
                    this.connection.on("AskQuestion", async (question: GameQuestion) => {
                        onAskQuestion(question);
                        let promise = new Promise<GameAnswer>((resolve, reject) => {
                            this.answerWaitingInterval = setInterval(() => {
                            if (this.isQuestionAnswered) {
                                resolve(this.answer);
                            }
                            }, 300);
                        });
                        return promise;
                    });
                    this.connection.on("ConfirmAnswerReceived", () => {
                        this.isQuestionAnswered = false;
                        clearInterval(this.answerWaitingInterval);
                        onConfirmAnswerReceived();
                    });
                    this.connection.on("GameConfigurationUpdated", (gameConfiguration: GameConfiguration) => {
                        onGameConfigurationUpdated(gameConfiguration);
                    });
                    this.connection.on("PlayerJoined", (playerInfo: PlayerInfo) => {
                        onPlayerJoined(playerInfo);
                    });
                    this.connection.on("PlayerLeft", (accountId: number) => {
                        onPlayerLeft(accountId);
                    });
                    this.connection.on("PlayerDisconnected", (accountId: number) => {
                        onPlayerDisconnected(accountId);
                    });
                    this.connection.on("PlayerReconnected", (accountId: number) => {
                        onPlayerReconnected(accountId);
                    });
                    this.connection.on("SendQuestionResult", (questionResult: QuestionResult) => {
                        this.isQuestionAnswered = false;
                        onSendQuestionResult(questionResult);
                    });
                    this.connection.on("SendQuestionTransitionMessage", (playerAnswers: PlayerAnswer[]) => {
                        this.isQuestionAnswered = false;
                        onSendQuestionTransitionMessage(playerAnswers);
                    });
                    this.connection.on("GameStarted", (gameConfiguration: GameConfiguration) => {
                        this.isQuestionAnswered = false;
                        onGameStarted(gameConfiguration);
                    });
                    this.connection.on("GameCompleted", (event: GameCompletedEvent) => {
                        onGameCompleted(event);
                        this.isReadyForGame = false;
                        this.isQuestionAnswered = false;
                        //this.currentGameName = undefined;
                    });
                    this.connection.on("DeckGameStarted", (playerDeckState: StandoffDeckState) => {
                        onDeckGameStarted(playerDeckState);
                    });
                    this.connection.on("SelectionStarted", (selectionData: StandoffAnimeSelection[]) => {
                        onSelectionStarted(selectionData);
                    });
                    
                    this.connection.on("LifeGameStarted", (lifeGameState: LifeGameState) => {
                        onLifeGameStarted(lifeGameState);
                    });
                    this.connection.on("LifeGameSecondPartStarted", (lifeGameState: LifeGameState) => {
                        onLifeGameSecondPartStarted(lifeGameState);
                    });
                    this.connection.on("LifeGameThirdPartStarted", (lifeGameState: LifeGameState) => {
                        onLifeGameThirdPartStarted(lifeGameState);
                    });
                    this.connection.on("LifeGameOtherPlayerMoved", (playerId: number, newPosition: number) => {
                        onLifeGameOtherPlayerMoved(playerId, newPosition);
                    });
                };
                this.isConnected = true;
                console.log("connected to game hub")
                return;
            }, 
            (err) => {
            console.log(err)
                setTimeout(() => {
                    this.startConnection()
                }, 1000);
            }
          )
    }
}
export default MultiplayerHubConnector.getInstance;