import { GameAction, GameResult, GameState } from "../types";
import { Card, ActionTypes, GameStatus } from '../types';
import { getCardDeck, isBlackJack, playerSurrenders, getStateWithNewCard, getStateWithBet, getRevealedCardsState, isBust, calcPoints } from '../utils';

export const localStorageBalance = 'BlackJackBalance';

const initialState: GameState = {
    availableCardsToDraw: getCardDeck(),
    player: {
        id: 'realPlayer',
        total_balance: 500,
        total_bet: 0,
        seat: {
            card_points: 0,
            cards: [] as Card[],
        },
        is_doubled: false 
    },
    dealer: {
        cards: [] as Card[],
        card_points: 0
    },
    result: {
        status: null,
        value: 0
    },
    status: GameStatus.LOADED
};

export function gameReducer(state = initialState, action: GameAction): GameState {
    switch(action.type) {
        case ActionTypes.PLACE_BET:
            const { value } = action.payload;
            return getStateWithBet(state, value);

        case ActionTypes.HIT:
            return getStateWithNewCard(state);

        case ActionTypes.STAND:
            return getRevealedCardsState(state);

        case ActionTypes.SURRENDER:
            const gameResult = playerSurrenders(state.player.seat.cards, state.player.total_bet);
            const newBalance = state.player.total_balance + gameResult.value;
            localStorage.setItem(localStorageBalance, newBalance.toString());
            return {
                ...state,
                result: gameResult,
                player: {
                    ...state.player,
                    total_balance: newBalance
                },
                dealer: {
                    ...state.dealer,
                    card_points: calcPoints(state.dealer.cards)
                },
                status: GameStatus.ENDED
            }

        case ActionTypes.INIT:
            return {
                ...state,
                status: GameStatus.WAITING_BETS
            }

        case ActionTypes.DOUBLE: 
            return getStateWithNewCard(state, true);


        case ActionTypes.WAIT_FOR_MOVE:
            const player = [...state.player.seat.cards];
            const dealer = [...state.dealer.cards];

            if (isBlackJack(dealer) || isBlackJack(player) || isBust(player)) {
                return getRevealedCardsState(state);
            }
            return {
                ...state,
                status: GameStatus.WAITING
            };

        case ActionTypes.REVEAL:
            return getRevealedCardsState(state);

        case ActionTypes.RESTART:
            return {
                ...state,
                status: GameStatus.LOADED,
                player: {
                    ...state.player,
                    total_bet: 0,
                    is_doubled: false
                },
                availableCardsToDraw: getCardDeck()
            }
    }

    return state;
}
