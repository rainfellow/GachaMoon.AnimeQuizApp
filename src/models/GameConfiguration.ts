export interface GameConfiguration {
    numberOfQuestions: number;
    questionTimeout: number;
    diversifyAnime: boolean;
    minReleaseYear: number;
    maxReleaseYear: number;
    minRating: number;
    maxRating: number;
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
    None, Connected, Lobby, Starting, Started, QuestionReceived, QuestionAnswered, AnswerReceived, QuestionTransition, Finished
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
    fromEpisode: number;
}

export interface GameDetails {
    gameName: string;
    currentPlayers: number;
    gameStatus: ServerGameState;
}

export enum ServerGameState {
    None, Waiting, Active, Playing, Finished
}

export interface PlayerInfo {
    accountId: number;
    accountName: string;
}

export interface GameJoinResult {
    isSuccessful: boolean;
    players: PlayerInfo[];
    gameConfiguration: GameConfiguration;
}

export interface PlayerLobbyStatus {
    status: LobbyStatus;
    gameName: string | null
}
export enum LobbyStatus {
    None, HasActiveGame, Idle
}

export interface ChatMessage {
    accountId: number;
    message: string;
}

export interface PlayerAnswer {
    accountId: number;
    answer: number;
    isCorrect: boolean;
    totalCorrect: number;
}