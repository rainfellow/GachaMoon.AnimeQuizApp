import { useContext } from "react";
import { SoloGameContext } from "../context/solo-game-context";
import { useAuth } from "./use-auth";
import SoloHubConnector from '../signalr-solohub'
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, GameState, QuestionResult } from "../models/GameConfiguration";
import { AnimeContext } from "@/context/anime-context";
import { useAnimeBase } from "./use-anime-base";
import { GameConfigurationContext } from "@/context/game-configuration-context";

export interface ISoloGame {
    connectToSoloLobby: () => Promise<void>;
    startSoloGame: () => Promise<void>;
    answerQuestion: (answer: GameAnswer) => void;
    endSoloGame: () => Promise<boolean>;
}

export const useSoloGame = (): ISoloGame => {
    const { account } = useAuth();
    const { events, startGame, connectToLobby, setQuestionAnswered, getGameName, endGame } = SoloHubConnector(account == null ? "" : account.token);
    const { gameConfiguration, setGameConfiguration } = useContext(GameConfigurationContext);
    const { gameState, setGameState,
      currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, 
      lastAnswerData, setLastAnswerData, gameRecap, setGameRecap, gameName, setGameName } = useContext(SoloGameContext);
    const { animeLoaded, animes } = useContext(AnimeContext);
    const { loadAnimes } = useAnimeBase();

    const handleAskQuestion = (question: GameQuestion) => {
        setGameState(GameState.QuestionReceived)
        console.log("received question:" + question.question + " type:" + question.questionType);
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
        setCorrectAnswers(event.correct);
        setGameRecap(event.gameRecap);
    }
    events(handleAskQuestion, handleConfirmAnswerReceived, handleQuestionResultReceived, handleQuestionTransitionMessage, handleGameStarted, handleGameCompleted );

    const loadAnime = async () => {
        if(!animeLoaded)
        {
          await loadAnimes();
        }
    }

    const connectToSoloLobby = async () => {        
        await loadAnime().then(() => { 
            connectToLobby()?.catch(() => {
                console.log("error while joining solo lobby")
            }).then(() => { setGameState(GameState.Lobby) }); 
        });
    };

    const startSoloGame = async () => {        
        setGameState(GameState.Starting)
        await startGame(gameConfiguration)?.catch(() => {
            console.log("error while starting game")
        }).then(() => {
        });
    };

    const endSoloGame = async () => {
        return await endGame();
    }

    const answerQuestion = (answer: GameAnswer) => {
        
        setQuestionAnswered(answer);
        setGameState(GameState.QuestionAnswered)
    }

    return { connectToSoloLobby, startSoloGame, answerQuestion, endSoloGame };
};
