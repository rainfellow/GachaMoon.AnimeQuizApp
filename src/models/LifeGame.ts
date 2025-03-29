export interface Player {
    position: number;
    currentPart: number;
    cards: number[];
}

export interface Tile {
    biomeTag?: string;
}

export interface EventCard {
    id: string;
    name: string;
}

export interface EventOption {
    id: string;
    name: string;
}

export interface LifeGameState {
    boardLength: number;
    players: Player[];
    currentPartTiles: Tile[];
    currentTileEvents: EventCard[];
    eventState: {
        isSelectingEvent: boolean;
        currentEvent: EventCard | null;
        eventOptions: EventOption[];
        isConfirming: boolean;
    };
    isGameComplete: boolean;
    currentPlayer: number;
}

export interface LifeGameMoveResult {
    isSuccessful: boolean;
    tileEvents: EventCard[];
    newPosition: number;
}

export interface MoveOption {
    type: 'basic' | 'card' | 'roll';
    distance?: number;
}

export const GetDefaultLifeGameState = () => {
    const result: LifeGameState = {
        boardLength: 0,
        players: [
            { position: 0, currentPart: 1, cards: [] },
            { position: 0, currentPart: 1, cards: [] }
        ],
        currentPartTiles: [{ biomeTag: "normal" }],
        currentTileEvents: [],
        eventState: {
            isSelectingEvent: false,
            currentEvent: null,
            eventOptions: [],
            isConfirming: false
        },
        isGameComplete: false,
        currentPlayer: 0
    };
    return result;
}