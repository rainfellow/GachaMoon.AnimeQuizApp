import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, GameQuestionType, GameRecap, GameState, GetDefaultConfiguration, PlayerAnswerRecap, PlayerAnswersRecapsMap, QuestionResult, SongGameConfiguration } from "../models/GameConfiguration";

export interface ISoloGameContext {
    isReady: boolean;
    setIsReady: (isReady: boolean) => void;
    gameState: GameState;
    setGameState: (gameState: GameState) => void;
    currentQuestion: GameQuestion;
    setCurrentQuestion: (currentQuestion: GameQuestion) => void;
    currentAnswer: GameAnswer;
    setCurrentAnswer: (currentAnswer: GameAnswer) => void;
    correctAnswers: number;
    setCorrectAnswers: (correctAnswers: number) => void;
    gameConfiguration: GameConfiguration;
    setGameConfiguration: (gameConfiguration: GameConfiguration) => void;
    lastAnswerData: QuestionResult;
    setLastAnswerData: (questionResult: QuestionResult) => void;
    gameRecap: GameRecap;
    setGameRecap: (gameRecap: GameRecap) => void;   
    gameName: string;
    setGameName: (gameName: string) => void;
    setQuestionNumber: (value: number) => void;
    setQuestionTimeout: (value: number) => void;
    setDiversifyAnime: (value: boolean) => void;
    setAnimeAllowedYears: (minYear: number, maxYear: number) => void;
    setAnimeAllowedRating: (minRating: number, maxRating: number) => void;
    setImageQuestions: (value: number) => void;
    setSongQuestions: (value: number) => void;
    setAllowMovie: (value: boolean) => void;
    setAllowTv: (value: boolean) => void;
    setAllowOva: (value: boolean) => void;
    setAllowMusic: (value: boolean) => void;
    setAllowSpecial: (value: boolean) => void;
    setSongConfiguration: (value: SongGameConfiguration) => void;
    setAllowOps: (value: boolean) => void;
    setAllowEds: (value: boolean) => void;
    setAllowIns: (value: boolean) => void;
}

export const SoloGameContext = createContext<ISoloGameContext>({
    
    isReady: false,
    setIsReady: () => { console.log("setting ready state") },
    gameState: GameState.None,
    setGameState: (gameState: GameState) => { console.log("setting game state:" + gameState) },
    currentQuestion: { question: "placeholder", questionType: "None" },
    setCurrentQuestion: () => { console.log("setting current question") },
    currentAnswer: { choice: undefined, customChoice: undefined },
    setCurrentAnswer: () => { console.log("setting current answer") },
    correctAnswers: 0,
    setCorrectAnswers: () => { console.log("setting correct answers number") },
    gameConfiguration: GetDefaultConfiguration(),
    setGameConfiguration: () => { console.log("setting game config") },
    lastAnswerData: { correctAnswerId: 0, detectedAnswerId: 0, isCorrect: false },
    setLastAnswerData: () => { console.log("setting game config") },
    gameRecap: { correctAnswers: [], playerAnswersRecaps: {} },
    setGameRecap: () => { console.log("setting game recap") },
    gameName: "",
    setGameName: () => { console.log("setting game name") },
    setQuestionNumber: () => { console.log("setting game name") },
    setQuestionTimeout: () => { console.log("setting game name") },
    setDiversifyAnime: () => { console.log("setting game name") },
    setAnimeAllowedYears: () => { console.log("setting game name") },
    setAnimeAllowedRating: () => { console.log("setting game name") },
    setImageQuestions: () => { console.log("setting game name") },
    setSongQuestions: () => { console.log("setting game name") },
    setAllowTv: () => { console.log("setting game name") },
    setAllowOva: () => { console.log("setting game name") },
    setAllowMovie: () => { console.log("setting game name") },
    setAllowMusic: () => { console.log("setting game name") },
    setAllowSpecial: () => { console.log("setting game name") },
    setSongConfiguration: () => { console.log("setting game name") },
    setAllowOps: () => { console.log("setting game name") },
    setAllowEds: () => { console.log("setting game name") },
    setAllowIns: () => { console.log("setting game name") }
});

interface SoloGameContextProviderProps {
    children: React.ReactNode;
}

export const SoloGameContextProvider: React.FC<SoloGameContextProviderProps> = ({
    children
}: SoloGameContextProviderProps): ReactElement => {
    
    const defaultQuestion: GameQuestion = { question: "test", questionType: "None" };
    const defaultAnswer: GameAnswer = { choice: undefined, customChoice: undefined };
    const [ isReady, setIsReady ] = useState(false);
    const [ gameName, setGameName ] = useState("");
    const [ gameState, setGameState ] = useState(GameState.None);
    const [ currentQuestion, setCurrentQuestion ] = useState(defaultQuestion);
    const [ currentAnswer, setCurrentAnswer ] = useState(defaultAnswer);
    const [ correctAnswers, setCorrectAnswers ] = useState(0);
    const [ lastAnswerData, setLastAnswerData ] = useState( { correctAnswerId: 0, detectedAnswerId: 0, isCorrect: false });
    const [ gameConfiguration, setGameConfiguration ] = useState(GetDefaultConfiguration());
    const [ gameRecap, setGameRecap ] = useState({ correctAnswers: [{answer: 0, question: ""}], playerAnswersRecaps: {} });
    const contextValue = {
        isReady,
        setIsReady: useCallback((isReady: boolean) => {
            setIsReady(isReady);
        }, []),
        gameState,
        setGameState: useCallback((gameState: GameState) => {
            setGameState(gameState);
        }, []),
        currentQuestion,
        setCurrentQuestion: useCallback((currentQuestion: GameQuestion) => {
            setCurrentQuestion(currentQuestion);
        }, []),
        currentAnswer,
        setCurrentAnswer: useCallback((currentAnswer: GameAnswer) => {
            setCurrentAnswer(currentAnswer);
        }, []),
        correctAnswers,
        setCorrectAnswers: useCallback((correctAnswers: number) => {
            setCorrectAnswers(correctAnswers);
        }, []),
        gameConfiguration,
        setGameConfiguration: useCallback((gameConfiguration: GameConfiguration) => {
            setGameConfiguration(gameConfiguration);
        }, []),
        lastAnswerData,
        setLastAnswerData: useCallback((lastAnswerData: QuestionResult) => {
            setLastAnswerData(lastAnswerData);
        }, []),
        gameRecap,
        setGameRecap: useCallback((gameRecap: GameRecap) => {
            setGameRecap(gameRecap);
        }, []),
        gameName,
        setGameName: useCallback((gameName: string) => {
            setGameName(gameName);
        }, []),
        setQuestionNumber: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.numberOfQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setQuestionTimeout: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.questionTimeout = value;
                return gameConfiguration;
            });
        }, []),
        setDiversifyAnime: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.diversifyAnime = value;
                return gameConfiguration;
            });
        }, []),
        setAnimeAllowedYears: useCallback((minYear: number, maxYear: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.minReleaseYear = minYear;
                gameConfiguration.maxReleaseYear = maxYear;
                return gameConfiguration;
            });
        }, []),
        setAnimeAllowedRating: useCallback((minRating: number, maxRating: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.minRating = minRating;
                gameConfiguration.maxRating = maxRating;
                return gameConfiguration;
            });
        }, []),
        setImageQuestions: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.imageQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setSongQuestions: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setAllowMovie: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowMovie = value;
                return gameConfiguration;
            });
        }, []),
        setAllowTv: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowTv = value;
                return gameConfiguration;
            });
        }, []),
        setAllowSpecial: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowSpecial = value;
                return gameConfiguration;
            });
        }, []),
        setAllowOva: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowOva = value;
                return gameConfiguration;
            });
        }, []),
        setAllowMusic: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowMusic = value;
                return gameConfiguration;
            });
        }, []),
        setSongConfiguration: useCallback((value: SongGameConfiguration) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration = value;
                return gameConfiguration;
            });
        }, []),
        setAllowOps: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.allowOps = value;
                return gameConfiguration;
            });
        }, []),
        setAllowEds: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.allowEds = value;
                return gameConfiguration;
            });
        }, []),
        setAllowIns: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.allowIns = value;
                return gameConfiguration;
            });
        }, []),
    };

    return (
        <SoloGameContext.Provider value={contextValue}>
            {children}
        </SoloGameContext.Provider>
    );
};
