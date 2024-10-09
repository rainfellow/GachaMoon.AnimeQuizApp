import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, GameRecap, GameState, PlayerAnswerRecap, PlayerAnswersRecapsMap, QuestionResult } from "../models/GameConfiguration";
import { List } from "@mantine/core";

export interface ISoloGameContext {
    isReady: boolean;
    setIsReady: (isReady: boolean) => void;
    gameState: GameState;
    setGameState: (gameState: GameState) => void;
    currentQuestion: GameQuestion;
    setCurrentQuestion: (currentQuestion: GameQuestion) => void;
    currentAnswer: GameAnswer;
    setCurrentAnswer: (currentAnswer: GameAnswer) => void;
    questionTimeoutValue: number;
    setQuestionTimeoutValue: (questionTimeoutValue: number) => void;
    numberOfQuestionsValue: number;
    setNumberOfQuestionsValue: (numberOfQuestionsValue: number) => void;
    correctAnswers: number;
    setCorrectAnswers: (correctAnswers: number) => void;
    gameConfiguration: GameConfiguration;
    setGameConfiguration: (gameConfiguration: GameConfiguration) => void;
    lastAnswerData: QuestionResult;
    setLastAnswerData: (questionResult: QuestionResult) => void;
    gameRecap: GameRecap;
    setGameRecap: (gameRecap: GameRecap) => void;   
}

export const SoloGameContext = createContext<ISoloGameContext>({
    
    isReady: false,
    setIsReady: () => { console.log("setting ready state") },
    gameState: GameState.None,
    setGameState: (gameState: GameState) => { console.log("setting game state:" + gameState) },
    currentQuestion: { question: "test" },
    setCurrentQuestion: () => { console.log("setting current question") },
    currentAnswer: { choice: undefined, customChoice: undefined },
    setCurrentAnswer: () => { console.log("setting current answer") },
    questionTimeoutValue: 20,
    setQuestionTimeoutValue: () => { console.log("setting question timeout setting") },
    numberOfQuestionsValue: 10,
    setNumberOfQuestionsValue: () => { console.log("setting quenstion number setting") },
    correctAnswers: 0,
    setCorrectAnswers: () => { console.log("setting correct answers number") },
    gameConfiguration: { questionTimeout: 20, numberOfQuestions: 10 },
    setGameConfiguration: () => { console.log("setting game config") },
    lastAnswerData: { correctAnswerId: 0, detectedAnswerId: 0, isCorrect: false },
    setLastAnswerData: () => { console.log("setting game config") },
    gameRecap: { correctAnswers: [], playerAnswersRecaps: {} },
    setGameRecap: () => { console.log("setting game recap") },
});

interface SoloGameContextProviderProps {
    children: React.ReactNode;
}

export const SoloGameContextProvider: React.FC<SoloGameContextProviderProps> = ({
    children
}: SoloGameContextProviderProps): ReactElement => {
    
    const defaultQuestion: GameQuestion = { question: "test" };
    const defaultAnswer: GameAnswer = { choice: undefined, customChoice: undefined };
    const [ isReady, setIsReady ] = useState(false);
    const [ gameState, setGameState ] = useState(GameState.None);
    const [ currentQuestion, setCurrentQuestion ] = useState(defaultQuestion);
    const [ currentAnswer, setCurrentAnswer ] = useState(defaultAnswer);
    const [questionTimeoutValue, setQuestionTimeoutValue] = useState(20);
    const [numberOfQuestionsValue, setNumberOfQuestionsValue] = useState(10);
    const [ correctAnswers, setCorrectAnswers ] = useState(0);
    const [ lastAnswerData, setLastAnswerData ] = useState( { correctAnswerId: 0, detectedAnswerId: 0, isCorrect: false });
    const [ gameConfiguration, setGameConfiguration ] = useState({ questionTimeout: 20, numberOfQuestions: 10 });
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
        questionTimeoutValue,
        setQuestionTimeoutValue: useCallback((questionTimeoutValue: number) => {
            setQuestionTimeoutValue(questionTimeoutValue);
        }, []),
        numberOfQuestionsValue,
        setNumberOfQuestionsValue: useCallback((numberOfQuestionsValue: number) => {
            setNumberOfQuestionsValue(numberOfQuestionsValue);
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

    };

    return (
        <SoloGameContext.Provider value={contextValue}>
            {children}
        </SoloGameContext.Provider>
    );
};
