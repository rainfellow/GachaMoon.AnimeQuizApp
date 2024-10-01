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
}

export interface GameAnswer {
    choice: number | undefined;
    customChoice: string | undefined;
}

export enum GameState {
    None, Lobby, Starting, QuestionReceived, QuestionAnswered, AnswerReceived, QuestionTransition, Finished
}