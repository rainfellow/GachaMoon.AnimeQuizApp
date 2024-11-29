export interface GameConfiguration {
    numberOfQuestions: number;
    questionTimeout: number;
    questionBonusTime: number;
    diversifyAnime: boolean;
    equalizeQuestions: boolean;
    allowRelatedAnswers: boolean;
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
    minUserScore: number;
    maxUserScore: number;
    songConfiguration: SongGameConfiguration;
    imageConfiguration: ImageGameConfiguration;
    forceIncludeGenres: string[];
    forceExcludeGenres: string[];
}

export const GetDefaultConfiguration = () => {
    const conf: GameConfiguration = {
        numberOfQuestions: 10,
        questionTimeout: 20,
        questionBonusTime: 0,
        diversifyAnime: true,
        equalizeQuestions: true,
        allowRelatedAnswers: false,
        minReleaseYear: 1970,
        maxReleaseYear: 2025,
        minRating: 0,
        maxRating: 10,
        imageQuestions: 5,
        songQuestions: 5,
        allowTv: true,
        allowMovie: true,
        allowSpecial: false,
        allowMusic: false,
        allowOva: true,
        minUserScore: 0,
        maxUserScore: 10,
        songConfiguration: {
            allowEds: false,
            allowIns: false,
            allowOps: true,
            minSongDifficulty: 0,
            maxSongDifficulty: 100,
            songQuestionsInList: 5,
            songQuestionsNotInList: 0,
            songQuestionsRandom: 0,
            minOpenings: 5,
            minEndings: 0,
            minInserts: 0,
            randomSongs: 0,
            songStartMinPercent: 10,
            songStartMaxPercent: 70
        },
        imageConfiguration: {
            imageQuestionsInList: 5,
            imageQuestionsNotInList: 0,
            imageQuestionsRandom: 0,
        },
        forceIncludeGenres: [],
        forceExcludeGenres: []
    };
    return conf;
}

export const ValidateConfiguration = (gameConfiguration: GameConfiguration) => {
    if (gameConfiguration.numberOfQuestions != gameConfiguration.songQuestions + gameConfiguration.imageQuestions)
    {
        return ConfigurationValidationResult.NumberOfQuestionsMismatch;
    }
    if (gameConfiguration.songQuestions != gameConfiguration.songConfiguration.minOpenings + gameConfiguration.songConfiguration.minEndings + gameConfiguration.songConfiguration.minInserts)
    {
        return ConfigurationValidationResult.SongTypesNumberMismatch;
    }
    if (gameConfiguration.songQuestions != gameConfiguration.songConfiguration.songQuestionsInList + gameConfiguration.songConfiguration.songQuestionsNotInList + gameConfiguration.songConfiguration.songQuestionsRandom)
    {
        return ConfigurationValidationResult.SongQuestionsMismatch;
    }
    if (gameConfiguration.imageQuestions != gameConfiguration.imageConfiguration.imageQuestionsInList + gameConfiguration.imageConfiguration.imageQuestionsNotInList + gameConfiguration.imageConfiguration.imageQuestionsRandom)
    {
        return ConfigurationValidationResult.ImageQuestionsMismatch;
    }
    if ((!gameConfiguration.songConfiguration.allowEds && gameConfiguration.songConfiguration.minEndings > 0) 
    || (!gameConfiguration.songConfiguration.allowIns && gameConfiguration.songConfiguration.minInserts > 0) 
    || (!gameConfiguration.songConfiguration.allowOps && gameConfiguration.songConfiguration.minOpenings > 0))
    {
        return ConfigurationValidationResult.SongTypesMismatch;
    }
    return ConfigurationValidationResult.Valid;
} 

export enum ConfigurationValidationResult {
    Valid = "Valid",
    NumberOfQuestionsMismatch = "NumberOfQuestionsMismatch",
    SongTypesNumberMismatch = "SongTypesNumberMismatch",
    SongQuestionsMismatch = "SongQuestionsMismatch",
    ImageQuestionsMismatch = "ImageQuestionsMismatch",
    SongTypesMismatch = "SongTypesMismatch"
}

export interface SongGameConfiguration {
    allowOps: boolean;
    allowEds: boolean;
    allowIns: boolean;
    minSongDifficulty: number;
    maxSongDifficulty: number;
    songQuestionsInList: number;
    songQuestionsNotInList: number;
    songQuestionsRandom: number;
    minOpenings: number;
    minEndings: number;
    minInserts: number;
    randomSongs: number;
    songStartMinPercent: number;
    songStartMaxPercent: number;
} 

export interface ImageGameConfiguration {
    imageQuestionsInList: number;
    imageQuestionsNotInList: number;
    imageQuestionsRandom: number;
}

export interface GameQuestion {
    question: string;
    questionType: string;
    songStartTime: number;
}

export const GetDefaultGameQuestion = () => {
    const question: GameQuestion = {
        question: "",
        questionType: "None",
        songStartTime: 0
    }
    return question;
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
    None, Connected, Lobby, DeckGame, AnimeSelection, Starting, Started, QuestionReceived, QuestionAnswered, AnswerReceived, QuestionTransition, Finished, Reconnecting
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
    gameType: GameType;
}

export enum ServerGameState {
    None, Waiting, Active, Playing, Finished
}

export enum GameType {
    None, Standard, Standoff
}

export interface PlayerInfo {
    accountId: number;
    accountName: string;
}

export interface GameJoinResult {
    isSuccessful: boolean;
    gameName: string;
    players: PlayerInfo[];
    gameConfiguration: GameConfiguration;
    gameChat: ChatData;
}

export interface GameRejoinResult {
    isSuccessful: boolean;
    players: PlayerInfo[];
    gameConfiguration: GameConfiguration;
    gameStatus: ServerGameState;
    playerAnswers: PlayerAnswer[];
    gameName: string;
    gameChat: ChatData;
}

export interface PlayerLobbyStatus {
    status: LobbyStatus;
    gameName: string | null
    chats: ChatData[] | null
}

export enum LobbyStatus {
    None, HasActiveGame, Idle
}

export interface ChatMessage {
    accountId: number;
    message: string;
}

export interface Chat {
    name: string;
    messages: ChatMessage[];
    chatType: ChatType;
    isArchived: boolean;
    members: number[]
    messageCount: number;
}

export enum ChatType {
    None, Game, Private, Public
}

export interface PlayerAnswer {
    accountId: number;
    answer: number;
    isCorrect: boolean;
    totalCorrect: number;
}

export interface ChatData {
    name: string;
    messages: ChatMessage[];
    type: ChatType;
    isArchived: boolean;
    members: number[]
}

export interface StandoffDeckState {
    deckValue: number;
    turnsRemaining: number;
    timeRemaining: number;
    moveSuccessful: boolean;
    playerDeck: StandoffCard[];
}

export interface StandoffCard {
    id: string;
    value: string;
    suit: string;
    enchantments: StandoffCardEnchantment[];
}

export interface StandoffCardEnchantment {
    type: string;
}

export interface StandoffAnimeSelection {
    cardId: string;
    type: string;
    selectCount: number;
    hasOptions: boolean;
    options: number[] | null;
    genreOptions: string[] | null;
}

export interface StandoffAnimeSelectionResult {
    cardId: string;
    selectedAnime: number[];
    selectedGenres: string[];
}