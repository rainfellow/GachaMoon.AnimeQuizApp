import * as signalR from "@microsoft/signalr";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, LobbyStatus, PlayerLobbyStatus, QuestionResult } from "./models/GameConfiguration";
const URL = "https://game.gachamoon.xyz/soloquiz";
class SoloHubConnector {
    private connection: signalR.HubConnection;
    private isConnected: boolean = false;
    private isQuestionAnswered: boolean = false;
    private answer: GameAnswer = { choice: undefined, customChoice: undefined};
    private currentGameName: string | undefined = undefined
    private answerWaitingInterval: NodeJS.Timeout | undefined = undefined;

    public events: ((
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
        this.events = (onAskQuestion, onConfirmAnswerReceived, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {}
        // this.connection.start().catch(err => console.log(err)).then(() => { 
            
        // });
        this.startConnection();
        
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
        })
    }

    public endGame = async () => {
        return this.connection.invoke("EndGame").then((x: boolean) => {
            if (x == true)
            {
                return true;
            }
            else
            {
                console.log("failed to prematurely end the game");
                return false;
            }
        })
    }    

    public getConnectionStatus = () =>
    {
        return this.isConnected;
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
    }

    private startConnection = () => {
        this.connection.start().then(
            () => {
                this.events = (onAskQuestion, onConfirmAnswerReceived, onSendQuestionResult, onSendQuestionTransitionMessage, onGameStarted, onGameCompleted) => {
                    this.connection.off("WriteMessage");
                    this.connection.off("AskQuestion");
                    this.connection.off("ConfirmAnswerReceived");
                    this.connection.off("SendQuestionResult");
                    this.connection.off("SendQuestionTransitionMessage");
                    this.connection.off("GameStarted");
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
                    this.connection.on("SendQuestionResult", (questionResult: QuestionResult) => {
                        this.isQuestionAnswered = false;
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
                        this.isQuestionAnswered = false;
                        //this.currentGameName = undefined;
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
export default SoloHubConnector.getInstance;