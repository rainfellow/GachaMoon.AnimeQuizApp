import { useContext } from "react";
import { SoloGameContext } from "../context/solo-game-context";
import { useAuth } from "./use-auth";
import SoloHubConnector from '../signalr-solohub'
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, GameState, QuestionResult } from "../models/GameConfiguration";
import { AnimeContext } from "@/context/anime-context";
import { useAnimeBase } from "./use-anime-base";

export interface ISoloGame {
    startSoloLobby: () => Promise<void>;
    startSoloGame: () => Promise<void>;
    answerQuestion: (answer: GameAnswer) => void;
}

export const useSoloGame = (): ISoloGame => {
    const { account } = useAuth();
    const { events, createGame, setGameSettings, setQuestionAnswered, setReadyForGame, getGameName } = SoloHubConnector(account == null ? "" : account.token);
    const { isReady, setIsReady, gameState, setGameState,
      questionTimeoutValue, setQuestionTimeoutValue, numberOfQuestionsValue, setNumberOfQuestionsValue,
      currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, 
      gameConfiguration, setGameConfiguration, lastAnswerData, setLastAnswerData, gameRecap, setGameRecap, gameName, setGameName } = useContext(SoloGameContext);
    const { animeLoaded, animes } = useContext(AnimeContext);
    const { loadAnimes } = useAnimeBase();

    
    const handleMessageReceived = (message: string) => {
        //
    }

    const handleWaitUntilReady = () => { 
        setGameState(GameState.Lobby)
    }

    const handleAskQuestion = (question: GameQuestion) => {
        setGameState(GameState.QuestionReceived)
        setCurrentQuestion(question);
    }

    const handleConfirmAnswerReceived = () => {
        setGameState(GameState.AnswerReceived)
    }

    const handleQuestionResultReceived = (questionResult: QuestionResult) => {
        setGameState(GameState.QuestionTransition)
        setLastAnswerData(questionResult)
        if (questionResult.isCorrect)
        {
            setCorrectAnswers(correctAnswers + 1);
        }
    }
    const handleQuestionTransitionMessage = (durationSeconds: number) => {
    //todo
    }
    const handleGameStarted = (gameConfiguration: GameConfiguration) => {
        setGameConfiguration(gameConfiguration)
        setCorrectAnswers(0);
        setGameState(GameState.Started)
        if(getGameName == undefined)
        {
            console.log('error. game name was undefined')
        }
        setGameName(getGameName() ?? "");
    }
    const handleGameCompleted = (event: GameCompletedEvent) => {
        console.log("game completed event triggered")
        setGameState(GameState.Finished)
        setIsReady(true);
        //setCurrentQuestion(defaultQuestion);
        //setCurrentAnswer(defaultAnswer);
        setCorrectAnswers(event.correct);
        setGameRecap(event.gameRecap);
    }
    events(handleMessageReceived , handleWaitUntilReady, handleAskQuestion, handleConfirmAnswerReceived, handleQuestionResultReceived, handleQuestionTransitionMessage, handleGameStarted, handleGameCompleted );

    const loadAnime = async () => {
        if(!animeLoaded)
        {
          await loadAnimes();
        }
    }

    const startSoloLobby = async () => {        
        await loadAnime().then(() => { 
            createGame()?.catch(() => {
                console.log("error while creating lobby")
            }).then(() => { setGameState(GameState.Lobby) }); 
        });
    };

    const startSoloGame = async () => {        
        setGameState(GameState.Starting)
        await setGameSettings({ numberOfQuestions: numberOfQuestionsValue, questionTimeout: questionTimeoutValue })?.catch(() => {
            console.log("error while starting game")
        }).then(() => {
            console.log("game settings set, starting...")
            setIsReady(true);
            setReadyForGame();
        });
    };

    const answerQuestion = (answer: GameAnswer) => {
        
        setQuestionAnswered(answer);
        if (answer.choice == undefined || answer.choice == 0)
        {
            console.log('used custom answer! ' + answer.customChoice)
        }
        setGameState(GameState.QuestionAnswered)
    }

    return { startSoloLobby, startSoloGame, answerQuestion };
};
