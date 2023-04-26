import { version } from "react";
import { Action } from "redux";

export enum ActionTypes {
    START = "startGame",
    PLACE_BET = "placeBet",
    HIT = "hit",
    SPLIT = "split",
    STAND = "stand",
    SURRENDER = "surrender",
    INIT = "INIT",
    DOUBLE = "double",
    TOSS = "toss"
}

export type GameAction =
    | { type: ActionTypes.START, payload: { name: string } }
    | { type: ActionTypes.PLACE_BET, payload: { value: number } }
    | { type: ActionTypes.SPLIT }
    | { type: ActionTypes.HIT, payload: { card: Card } }
    | { type: ActionTypes.STAND }
    | { type: ActionTypes.SURRENDER }
    | { type: ActionTypes.INIT }
    | { type: ActionTypes.DOUBLE }
    | { type: ActionTypes.TOSS }

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

type Player = {
    id: string,
    total_balance: number;
    total_bet: number;
    seats: {
        id: number;
        card_points: number;
        cards: Card[];
    }[];
};


export enum GameStatus {
    LOADED,
    STARTED,
    ENDED,
    WAITING_BETS,
    WAITING
}

export interface GameState {
    player: Player;
    availableCardsToDraw: Card_Deck;
    NPC: Player[] | null;
    total_seats: number;
    status: GameStatus;
    dealer: {
        cards: Card[];
        card_points: number;
    }
    // taken_seats: number[];
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