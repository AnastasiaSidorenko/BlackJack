import { GameAction, GameState } from "../types";
import { isEqual, reduce, uniq } from "lodash";
import { Card, ActionTypes, GameStatus } from '../types';
import { getCardDeck, calcPoints } from '../utils';

const initialState: GameState = {
    availableCardsToDraw: getCardDeck(),
    player: {
        id: 'realPlayer',
        total_balance: 500,
        total_bet: 0,
        seats: [{
            id: 0,
            card_points: 0,
            cards: [] as Card[]
        }]
    },
    dealer: {
        cards: [] as Card[],
        card_points: 0
    },
    NPC: null,
    total_seats: 1,
    status: GameStatus.LOADED
};

// calc winning bet

export function gameReducer(state = initialState, action: GameAction): GameState {
    switch(action.type) {

        case ActionTypes.START:
            return {
                ... state,
                status: GameStatus.STARTED
            }
        // break; 

        case ActionTypes.PLACE_BET:
            const { value } = action.payload;
            if (state.player.total_balance > action.payload.value) {
                return {
                    ...state,
                    player: {
                        ...state.player,
                        total_balance: state.player.total_balance = value,
                        total_bet: state.player.total_bet + value
                    }
                }
            }
            // return state;
        break;

        case ActionTypes.HIT:
            const { card } = action.payload;
            const newSeatsInfo = state.player.seats;
            const currentCards = newSeatsInfo[0].cards;
            const newCards = [...currentCards, card]
            newSeatsInfo[0] = {
                ...newSeatsInfo[0],
                cards: newCards,
                card_points: calcPoints(newCards)
            };
            return {
                ...state,
                player: {
                    ...state.player,
                    seats: newSeatsInfo
                }            
            }
            // calculate card points
        // break;

        case ActionTypes.STAND:
        // не брать карты
            return {
                ...state,
                status: GameStatus.STARTED
            }
        break;

        case ActionTypes.SURRENDER:
        // отдать половину ставки
        //Если у дилера туз, он автоматически проверяет, нет ли у него блэкджека.
        // Ранняя сдача — игрок решает отдать полставки до того, как дилер проверит, есть ли у него блэкджек
        break;

        case ActionTypes.INIT:
            return {
                ...state,
                status: GameStatus.WAITING_BETS
            }
        break;

        case ActionTypes.TOSS:
        // get cards for everyone and calculate points
        break;

        case ActionTypes.DOUBLE: 
        // вы удваиваете ставку и получаете еще только одну карту.
        // Обычно удвоение используется, если сумма ваших первых двух карт равна от 8 до 11, а в случае «мягкой руки» — от 12 до 19.
        break;

        case ActionTypes.SPLIT:
        // Сплит делается разведением карт в стороны и повторением первоначальной ставки
        break;
    }
    // your code here

    return state;
}
