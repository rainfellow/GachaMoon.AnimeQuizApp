import * as signalR from "@microsoft/signalr";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, QuestionResult } from "./models/GameConfiguration";
const URL = "https://game.gachamoon.xyz/soloquiz";
class SoloHubConnector {
    private connection: signalR.HubConnection;
    private isConnected: boolean = false;
    private isReadyForGame: boolean = false;
    private isQuestionAnswered: boolean = false;
    private isResolved: boolean = false;
    private answer: GameAnswer = { choice: undefined, customChoice: undefined};

    public events: ((
        onMessageReceived: (message: string) => void,
        onWaitReady: () => void,
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
        this.events = (onMessageReceived, onWaitReady, onAskQuestion, onConfirmAnswerReceived, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {}
        this.connection.start().catch(err => console.log(err)).then(() => { 
            this.events = (onMessageReceived, onWaitReady, onAskQuestion, onConfirmAnswerReceived, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {
                this.connection.off("WriteMessage");
                this.connection.off("WaitReady");
                this.connection.off("AskQuestion");
                this.connection.off("ConfirmAnswerReceived");
                this.connection.off("SendQuestionResult");
                this.connection.off("SendQuestionTransitionMessage");
                this.connection.off("GameStarted");
                this.connection.on("WriteMessage", (message: string) => {
                    onMessageReceived(message);
                });
                this.connection.on("WaitReady", async () => {
                    onWaitReady()
                    
                    let promise: Promise<boolean> = new Promise((resolve, reject) => {
                        const intervalId = setInterval(() => {
                          if (this.isReadyForGame) {
                            clearInterval(intervalId);
                            this.isReadyForGame = false;
                            resolve(true);
                          }
                        }, 100);
                      });
                    return promise;
                });
                this.connection.on("AskQuestion", async (question: GameQuestion) => {
                    onAskQuestion(question);
                    let promise = new Promise<GameAnswer>((resolve, reject) => {
                        const intervalId = setInterval(() => {
                        if (this.isQuestionAnswered) {
                            clearInterval(intervalId);
                            this.isQuestionAnswered = false;
                            resolve(this.answer);
                        }
                        }, 100);
                    });
                    return promise;
                });
                this.connection.on("ConfirmAnswerReceived", () => {
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
                });
            };
            this.isConnected = true;
        });
        
    }

    public createGame = async () => {
        await new Promise<boolean>((resolve) => {
            const intervalId = setInterval(() => {
              if (this.isConnected) {
                clearInterval(intervalId);
                resolve(true);
              }
            }, 100);
        });
        this.connection.invoke("JoinSoloLobby").then(x => console.log("joined game " + x))
    }
    
    public setGameSettings = (gameConfiguration: GameConfiguration) => {
        return this.connection.invoke("SetGameSettings", gameConfiguration).then(x => x === true ? console.log("successfully changed game settings") : console.log("error while changing game settings " + x))
    }

    public setReadyForGame = () =>
    {
        this.isReadyForGame = true;
    }
    public setQuestionAnswered = (answer: GameAnswer) =>
    {
        this.answer = answer;
        this.isQuestionAnswered = true;
    }

    public static getInstance(authToken: string): SoloHubConnector {
        if (!SoloHubConnector.instance)
            SoloHubConnector.instance = new SoloHubConnector(authToken);
        return SoloHubConnector.instance;
    }
}
export default SoloHubConnector.getInstance;