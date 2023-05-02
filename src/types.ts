export enum ActionTypes {
    START = "startGame",
    PLACE_BET = "placeBet",
    HIT = "hit",
    STAND = "stand",
    SURRENDER = "surrender",
    INIT = "INIT",
    DOUBLE = "double",
    DEALING = "dealing",
    REVEAL = "reveal",
    WAIT_FOR_MOVE = "wait for move",
    RESTART = "restart"
}

export type GameAction =
    | { type: ActionTypes.START, payload: { name: string } }
    | { type: ActionTypes.PLACE_BET, payload: { value: number } }
    | { type: ActionTypes.HIT, payload: { card: Card } }
    | { type: ActionTypes.STAND }
    | { type: ActionTypes.SURRENDER }
    | { type: ActionTypes.INIT }
    | { type: ActionTypes.DOUBLE }
    | { type: ActionTypes.DEALING }
    | { type: ActionTypes.WAIT_FOR_MOVE }
    | { type: ActionTypes.REVEAL }
    | { type: ActionTypes.RESTART }

export type Suit = 'club' | 'diamond' | 'heart' | 'spade';
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Card = {
    suit: Suit;
    value: CardValue;
}

export enum SuitEnum {
    CLUB = 'club',
    DIAMOND = 'diamond',
    HEART = 'heart',
    SPADE = 'spade'
}

export type Card_Deck = Card[];

export type Seat = {
    card_points: number;
    cards: Card[];
};

type Player = {
    id: string,
    total_balance: number;
    total_bet: number;
    seat: Seat;
};

export type PositionType = {
    x: number, y: number
}

export enum GameStatus {
    LOADED,
    STARTED,
    ENDED,
    WAITING_BETS,
    WAITING,
    DEALING
}

export enum GameResult { 
    DEFEAT,
    WIN
}

export type Result = {
    status: GameResult | null,
    value: number
}

export interface GameState {
    player: Player;
    availableCardsToDraw: Card_Deck;
    NPC: Player[] | null;
    status: GameStatus;
    dealer: {
        cards: Card[];
        card_points: number;
    },
    result: Result
}

export interface SizeProps {
    width: number;
    height: number;
}

export interface PositionProps {
    position: {
        x: number,
        y: number
    }
}