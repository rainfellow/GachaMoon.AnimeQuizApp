import React, { createContext, useCallback, useContext, useState } from "react";
import type { ReactElement } from "react";
import { GameAnswer, GameQuestion, GameRecap, GameState, QuestionResult, ChatMessage, GameDetails, ServerGameState, PlayerInfo, PlayerAnswer, GetDefaultGameQuestion, GameType, StandoffDeckState, StandoffAnimeSelection } from "../models/GameConfiguration";
import { EventCard, GetDefaultLifeGameState, LifeGameState } from "@/models/LifeGame";

export interface IMultiplayerGameContext {
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
    lastAnswerData: QuestionResult;
    setLastAnswerData: (questionResult: QuestionResult) => void;
    gameRecap: GameRecap;
    setGameRecap: (gameRecap: GameRecap) => void;   
    gameName: string;
    setGameName: (gameName: string) => void;
    isLobbyLeader: boolean;
    setIsLobbyLeader: (isReady: boolean) => void;
    activeGames: GameDetails[];
    setActiveGames: (activeGames: GameDetails[]) => void;
    currentGamePlayers: PlayerInfo[];
    setCurrentGamePlayers: (players: PlayerInfo[]) => void;
    playerAnswers: PlayerAnswer[];
    setPlayerAnswers: (playerAnswers: PlayerAnswer[]) => void;
    deckState: StandoffDeckState;
    setDeckState: (deckState: StandoffDeckState) => void;
    selectionData: StandoffAnimeSelection[];
    setSelectionData: (selectionData: StandoffAnimeSelection[]) => void;
    addPlayerToList: (player: PlayerInfo) => void;
    lifeGameState: LifeGameState;
    setLifeGameState: (state: LifeGameState) => void;
    updateCurrentTile: (newPosition: number, events: EventCard[]) => void; 
    updateLifeGamePlayer: (playerId: number, newPosition: number) => void; 
}

export const MultiplayerGameContext = createContext<IMultiplayerGameContext>({
    
    isReady: false,
    setIsReady: () => { console.log("setting ready state") },
    gameState: GameState.None,
    setGameState: (gameState: GameState) => { console.log("setting game state:" + gameState) },
    currentQuestion: GetDefaultGameQuestion(),
    setCurrentQuestion: () => { console.log("setting current question") },
    currentAnswer: { choice: undefined, customChoice: undefined },
    setCurrentAnswer: () => { console.log("setting current answer") },
    correctAnswers: 0,
    setCorrectAnswers: () => { console.log("setting correct answers number") },
    lastAnswerData: { correctAnswerId: 0, detectedAnswerId: 0, isCorrect: false },
    setLastAnswerData: () => { console.log("setting game config") },
    gameRecap: { correctAnswers: [], playerAnswersRecaps: {} },
    setGameRecap: () => { console.log("setting game recap") },
    gameName: "",
    setGameName: () => { console.log("setting game name") },
    isLobbyLeader: false,
    setIsLobbyLeader: () => { console.log("setting lobby leader status") },
    activeGames: [{
        gameName: "", gameStatus: ServerGameState.None, currentPlayers: 0,
        gameType: GameType.None
    }],
    setActiveGames: () => { console.log("updating axtive games list") },
    currentGamePlayers: [],
    setCurrentGamePlayers: () => { console.log("updating players list") },
    playerAnswers: [],
    setPlayerAnswers: () => { console.log("updating player answers") },
    deckState: { deckValue: 0, playerDeck: [], turnsRemaining: 0, timeRemaining: 0, moveSuccessful: false },
    setDeckState: () => { console.log("updating deck state") },
    selectionData: [],
    setSelectionData: () => { console.log("updating players list") },
    addPlayerToList: () => { console.log("updating players list") },
    lifeGameState: GetDefaultLifeGameState(),
    setLifeGameState: () => {},
    updateCurrentTile: () => {},
    updateLifeGamePlayer: () => {}
});

interface MultiplayerGameContextProviderProps {
    children: React.ReactNode;
}

export const MultiplayerGameContextProvider: React.FC<MultiplayerGameContextProviderProps> = ({
    children
}: MultiplayerGameContextProviderProps): ReactElement => {
    
    const defaultAnswer: GameAnswer = { choice: undefined, customChoice: undefined };
    const [ isReady, setIsReady ] = useState(false);
    const [ isLobbyLeader, setIsLobbyLeader ] = useState(false);
    const [ playerAnswers, setPlayerAnswers ] = useState<PlayerAnswer[]>([]);
    const [currentGamePlayers, setCurrentGamePlayers] = useState<PlayerInfo[]>([{accountId: 0, accountName: 'PLACEHOLDER'}])
    const [ activeGames, setActiveGames ] = useState<GameDetails[]>([{ gameName: "", gameStatus: ServerGameState.None, currentPlayers: 0, gameType: GameType.None }]);
    const [ gameName, setGameName ] = useState("");
    const [ gameState, setGameState ] = useState(GameState.None);
    const [ currentQuestion, setCurrentQuestion ] = useState(GetDefaultGameQuestion());
    const [ currentAnswer, setCurrentAnswer ] = useState(defaultAnswer);
    const [ correctAnswers, setCorrectAnswers ] = useState(0);
    const [ selectionData, setSelectionData ] = useState<StandoffAnimeSelection[]>([]);
    const [ deckState, setDeckState ] = useState<StandoffDeckState>({ deckValue: 0, playerDeck: [], turnsRemaining: 0, timeRemaining: 0, moveSuccessful: false });
    const [ lastAnswerData, setLastAnswerData ] = useState( { correctAnswerId: 0, detectedAnswerId: 0, isCorrect: false });
    const [ gameRecap, setGameRecap ] = useState({ correctAnswers: [{answer: 0, question: ""}], playerAnswersRecaps: {} });
    const [ lifeGameState, setLifeGameState ] = useState(GetDefaultLifeGameState());
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
        isLobbyLeader,
        setIsLobbyLeader: useCallback((islobbyLeader: boolean) => {
            setIsLobbyLeader(islobbyLeader);
        }, []),
        activeGames,
        setActiveGames: useCallback((activeGames: GameDetails[]) => {
            setActiveGames(activeGames);
        }, []),
        currentGamePlayers,
        setCurrentGamePlayers: useCallback((players: PlayerInfo[]) => {
            setCurrentGamePlayers(players);
        }, []),
        playerAnswers,
        setPlayerAnswers: useCallback((playerAnswers: PlayerAnswer[]) => {
            setPlayerAnswers(playerAnswers);
        }, []),
        deckState,
        setDeckState: useCallback((deckState: StandoffDeckState) => {
            setDeckState(deckState);
        }, []),
        selectionData,
        setSelectionData: useCallback((selectionData: StandoffAnimeSelection[]) => {
            setSelectionData(selectionData);
        }, []),
        addPlayerToList: useCallback((player: PlayerInfo) => {
            setCurrentGamePlayers((players) => 
            {
                players.push(player);
                return players;
            });
        }, []),
        lifeGameState,
        setLifeGameState: useCallback((lifeGameState: LifeGameState) => {
            setLifeGameState((state) => 
            {
                state = lifeGameState;
                return state;
            });
        }, []),
        updateCurrentTile: useCallback((newPosition: number, events: EventCard[]) => {
            setLifeGameState((state) => 
            {
                state.players[state.currentPlayer].position = newPosition;
                state.currentTileEvents = events;
                return state;
            });
        }, []),
        updateLifeGamePlayer: useCallback((playerId: number, newPosition: number) => {
            setLifeGameState((state) => 
            {
                state.players[playerId].position = newPosition;
                return state;
            });
        }, []),
    };

    return (
        <MultiplayerGameContext.Provider value={contextValue}>
            {children}
        </MultiplayerGameContext.Provider>
    );
};
