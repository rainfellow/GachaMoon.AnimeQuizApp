import * as signalR from "@microsoft/signalr";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, LobbyStatus, PlayerLobbyStatus, QuestionResult } from "./models/GameConfiguration";
const URL = "https://game.gachamoon.xyz/soloquiz";
class SoloHubConnector {
    private connection: signalR.HubConnection;
    private isConnected: boolean = false;
    private isReadyForGame: boolean = false;
    private isQuestionAnswered: boolean = false;
    private answer: GameAnswer = { choice: undefined, customChoice: undefined};
    private currentGameName: string | undefined = undefined
    private answerWaitingInterval: NodeJS.Timeout | undefined = undefined;
    private lobbyWaitingInterval: NodeJS.Timeout | undefined = undefined;

    public events: ((
        onMessageReceived: (message: string) => void,
        onAskQuestion: (question: GameQuestion) => void,
        onConfirmAnswerReceived: () => void,
        onSendQuestionResult: (questionResult: QuestionResult) => void,
        onSendQuestionTransitionMessage: (durationSeconds: number) => void,
        onGameStarted: (gameConfiguration: GameConfiguration) => void,
        onGameCompleted: (event: GameCompletedEvent) => void
    ) => void);

    static instance: SoloHubConnector;
    constructor(authToken: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                accessTokenFactory: () => authToken,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
              })
            .withAutomaticReconnect()
            .build();
        this.events = (onMessageReceived, onAskQuestion, onConfirmAnswerReceived, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {}
        this.connection.start().catch(err => console.log(err)).then(() => { 
            this.events = (onMessageReceived, onAskQuestion, onConfirmAnswerReceived, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {
                this.connection.off("WriteMessage");
                this.connection.off("AskQuestion");
                this.connection.off("ConfirmAnswerReceived");
                this.connection.off("SendQuestionResult");
                this.connection.off("SendQuestionTransitionMessage");
                this.connection.off("GameStarted");
                this.connection.on("WriteMessage", (message: string) => {
                    onMessageReceived(message);
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
                this.connection.on("SendQuestionResult", (questionResult: QuestionResult) => {
                    onSendQuestionResult(questionResult);
                });
                this.connection.on("SendQuestionTransitionMessage", (durationSeconds: number) => {
                    this.isQuestionAnswered = false;
                    onSendQuestionTransitionMessage(durationSeconds);
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
            else
            {
                this.isReadyForGame = true;
            }
        })
    }

    public startGame = async (gameConfiguration: GameConfiguration) => {
        await new Promise<boolean>((resolve) => {
            const intervalId = setInterval(() => {
              if (this.isConnected) {
                clearInterval(intervalId);
                resolve(true);
              }
            }, 100);
        });
        this.connection.invoke("StartGame", gameConfiguration).then((x: string) => {
            this.currentGameName = x;
            console.log("joined game " + x);
        })
    }
    
    private setGameSettings = (gameConfiguration: GameConfiguration) => {
        return this.connection.invoke("SetGameSettings", gameConfiguration).then(x => x === true ? console.log("successfully changed game settings") : console.log("error while changing game settings " + x))
    }

    public setQuestionAnswered = (answer: GameAnswer) =>
    {
        this.answer = answer;
        this.isQuestionAnswered = true;
    }

    public getGameName = () =>
    {
        return this.currentGameName;
    }

    public static getInstance(authToken: string): SoloHubConnector {
        if (!SoloHubConnector.instance)
            SoloHubConnector.instance = new SoloHubConnector(authToken);
        return SoloHubConnector.instance;
    }

    private resetGameStates = () => {
        this.currentGameName = "";
        this.isQuestionAnswered = false;
        this.answer = { choice: undefined, customChoice: undefined};
        this.isReadyForGame = false;
    }
}
export default SoloHubConnector.getInstance;