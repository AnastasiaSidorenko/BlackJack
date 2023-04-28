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
    DEALING = "dealing",
    REVEAL = "reveal",
    PASS_FURTHER = "pass further"
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
    | { type: ActionTypes.DEALING }
    | { type: ActionTypes.REVEAL }
    | { type: ActionTypes.PASS_FURTHER }

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
    id: number;
    card_points: number;
    cards: Card[];
    bet: number;
};

type Player = {
    id: string,
    total_balance: number;
    total_bet: number;
    seats: Seat[];
};


export enum GameStatus {
    LOADED,
    STARTED,
    ENDED,
    WAITING_BETS,
    WAITING,
    DEALING,
    REVEAL
}

export enum GameResult { 
    DEFEAT,
    WIN
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
    },
    result: {
        status: GameResult | null,
        value: number
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