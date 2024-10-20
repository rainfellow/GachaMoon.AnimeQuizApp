export interface GameConfiguration {
    numberOfQuestions: number;
    questionTimeout: number;
    diversifyAnime: boolean;
    minReleaseYear: number;
    maxReleaseYear: number;
    minRating: number;
    maxRating: number;
    imageQuestions: number;
    songQuestions: number;
    allowTv: boolean;
    allowMovie: boolean;
    allowSpecial: boolean;
    allowMusic: boolean;
    allowOva: boolean;
    songConfiguration: SongGameConfiguration;
}

export const GetDefaultConfiguration = () => {
    const conf: GameConfiguration = {
        numberOfQuestions: 10,
        questionTimeout: 20,
        diversifyAnime: true,
        minReleaseYear: 1970,
        maxReleaseYear: 2015,
        minRating: 0,
        maxRating: 10,
        imageQuestions: 5,
        songQuestions: 5,
        allowTv: true,
        allowMovie: true,
        allowSpecial: false,
        allowMusic: false,
        allowOva: true,
        songConfiguration: {
            allowEds: false,
            allowIns: false,
            allowOps: true
        }
    };
    return conf;
}

export interface SongGameConfiguration {
    allowOps: boolean;
    allowEds: boolean;
    allowIns: boolean;
} 

export interface GameQuestion {
    question: string;
    questionType: string;
}
export enum GameQuestionType {
    Image, Song
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
    None, Connected, Lobby, Starting, Started, QuestionReceived, QuestionAnswered, AnswerReceived, QuestionTransition, Finished, Reconnecting
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