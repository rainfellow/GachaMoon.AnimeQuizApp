import * as signalR from "@microsoft/signalr";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameDetails, GameJoinResult, GameQuestion, LobbyStatus, PlayerAnswer, PlayerInfo, PlayerLobbyStatus, QuestionResult } from "./models/GameConfiguration";
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
    private lobbyWaitingInterval: NodeJS.Timeout | undefined = undefined;

    public events: ((
        onMessageSent: (message: string, accountId: number) => void,
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
        onGameCompleted: (event: GameCompletedEvent) => void
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
        this.events = (onMessageReceived, onAskQuestion, onConfirmAnswerReceived, onGameConfigurationUpdated, onPlayerJoined, onPlayerLeft, onPlayerDisconnected, onPlayerReconnected, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {}
        this.connection.start().catch(err => console.log(err)).then(() => { 
            this.events = (onMessageReceived, onAskQuestion, onConfirmAnswerReceived, onGameConfigurationUpdated, onPlayerJoined, onPlayerLeft, onPlayerDisconnected, onPlayerReconnected, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {
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
                this.connection.on("MessageReceived", (message: string, accountId: number) => {
                    onMessageReceived(message, accountId);
                });
                this.connection.on("AskQuestion", async (question: GameQuestion) => {
                    onAskQuestion(question);
                    let promise = new Promise<GameAnswer>((resolve, reject) => {
                        this.answerWaitingInterval = setInterval(() => {
                        if (this.isQuestionAnswered) {
                            resolve(this.answer);
                        }
                        }, 100);
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
                this.connection.on("PlayerDisconnecter", (accountId: number) => {
                    onPlayerDisconnected(accountId);
                });
                this.connection.on("PlayerReconnected", (accountId: number) => {
                    onPlayerReconnected(accountId);
                });
                this.connection.on("SendQuestionResult", (questionResult: QuestionResult) => {
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
            };
            this.isConnected = true;
        });
        
    }

    public connectToLobby = async () => {
        return this.connection.invoke("ConnectToLobby").then((x: PlayerLobbyStatus) => {
            this.resetGameStates();
            if (x.status == LobbyStatus.HasActiveGame)
            {
                console.log("connected to lobby while having an active game. reconnecting! game: " + x.gameName);
                return x.gameName;
            }
        })
    }

    public createNewGame = async () => {
        return this.connection.invoke("CreateGame").then((x: string | null) => {
            if (x != null)
            {
                this.currentGameName = x;
                this.isLobbyLeader = true;
                console.log("created new game! " + x);
                return true;
            }
            else
            {
                console.log("failed to create new game");
                return false;
            }
        })

    }
    
    public setGameSettings = (gameConfiguration: GameConfiguration) => {
        return this.connection.invoke("SetGameOptions", gameConfiguration).then(x => x === true ? console.log("successfully changed game settings") : console.log("error while changing game settings " + x))
    }

    public setReadyForGame = async (readyStatus: boolean) =>
    {
        console.log('setting ready status to:' + readyStatus);
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

    public sendMessage = async (message: string) => {
        return this.connection.invoke("SendMessage", message).then((x: boolean) => { console.log('message receiver by server!'); return x });
        
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
        return this.connection.invoke("TryRejoinGame", gameName).then((x: GameJoinResult) => { 
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

    public getGameName = () =>
    {
        return this.currentGameName;
    }

    public getLobbyLeaderStatus = () => {
        return this.isLobbyLeader;
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
}
export default MultiplayerHubConnector.getInstance;