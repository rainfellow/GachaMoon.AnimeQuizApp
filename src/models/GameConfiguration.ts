export interface GameConfiguration {
    numberOfQuestions: number;
    questionTimeout: number;
}

export interface GameQuestion {
    question: string;
}

export interface QuestionResult {
    correctAnswerId: number;
    detectedAnswerId: number;
    isCorrect: boolean;
}

export interface GameCompletedEvent {
    correct: number;
    name: string;
    gameRecap: GameRecap;
}

export interface GameAnswer {
    choice: number | undefined;
    customChoice: string | undefined;
}

export enum GameState {
    None, Lobby, Starting, Started, QuestionReceived, QuestionAnswered, AnswerReceived, QuestionTransition, Finished
}

export interface GameRecap {
    correctAnswers: QuestionRecap[];
    playerAnswersRecaps: PlayerAnswersRecapsMap;

}
export interface QuestionRecap {
    answer: number;
    question: string;
}

export interface PlayerAnswersRecapsMap {
    [key: number]: PlayerAnswerRecap[];
}

export interface PlayerAnswerRecap {
    playerAnswer: number;
    isCorrect: boolean;
    timeToAnswer: number;
}