import { GameAction, GameResult, GameState } from "../types";
import { Card, ActionTypes, GameStatus } from '../types';
import { getCardDeck, isBlackJack, playerSurrenders, getStateWithNewCard, getStateWithBet, getRevealedCardsState } from '../utils';

export const localStorageBalance = 'BlackJackBalance';

const initialState: GameState = {
    availableCardsToDraw: getCardDeck(),
    player: {
        id: 'realPlayer',
        total_balance: Number(localStorage.getItem(localStorageBalance)) || 5000,
        total_bet: 0,
        seat: {
            card_points: 0,
            cards: [] as Card[],
        },
    },
    dealer: {
        cards: [] as Card[],
        card_points: 0
    },
    result: {
        status: null,
        value: 0
    },
    /* result: {
        status: GameResult.DEFEAT,
        value: 0
    }, */
    NPC: null,
    // total_seats: 1,
    // status: GameStatus.LOADED
    status: GameStatus.LOADED
    // status: GameStatus.WAITING
};

// calc winning bet
// TODO if balance less than 5 don't allow to play

export function gameReducer(state = initialState, action: GameAction): GameState {
    switch(action.type) {
        case ActionTypes.PLACE_BET:
            const { value } = action.payload;
            console.log("ACTION", value);
            return getStateWithBet(state, value);

        case ActionTypes.HIT:
            return getStateWithNewCard(state);

        case ActionTypes.STAND:
            return getRevealedCardsState(state);

        case ActionTypes.SURRENDER:
        // TODO отдать половину ставки
        //Если у дилера туз, он автоматически проверяет, нет ли у него блэкджека.
        // Ранняя сдача — игрок решает отдать полставки до того, как дилер проверит, есть ли у него блэкджек
            const gameResult = playerSurrenders(state.player.seat.cards, state.player.total_bet);
            const newBalance = state.player.total_balance - gameResult.value;
            localStorage.setItem(localStorageBalance, newBalance.toString());
            return {
                ...state,
                result: gameResult,
                player: {
                    ...state.player,
                    total_balance: newBalance
                }
            }

        case ActionTypes.INIT:
            return {
                ...state,
                status: GameStatus.WAITING_BETS
            }

        case ActionTypes.DOUBLE: 
        //TODO вы удваиваете ставку и получаете еще только одну карту.
        // Обычно удвоение используется, если сумма ваших первых двух карт равна от 8 до 11, а в случае «мягкой руки» — от 12 до 19.
            return getStateWithNewCard(state, true);
        break;


        case ActionTypes.WAIT_FOR_MOVE:
            const player = [...state.player.seat.cards];
            const dealer = [...state.dealer.cards];
            if (isBlackJack(dealer) || isBlackJack(player)) {
                return getRevealedCardsState(state);
            }
            return {
                ...state,
                status: GameStatus.WAITING
            };

        case ActionTypes.REVEAL:
            console.log("REVEAL");
            return getRevealedCardsState(state);

        case ActionTypes.RESTART:

            return {
                ...state,
                status: GameStatus.LOADED
            }
    }

    return state;
}
