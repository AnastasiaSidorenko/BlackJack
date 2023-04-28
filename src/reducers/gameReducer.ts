import { GameAction, GameState } from "../types";
import { isEqual, reduce, uniq } from "lodash";
import { Card, ActionTypes, GameStatus } from '../types';
import { getCardDeck, calcPoints } from '../utils';
import { Game } from "../components/game";

const initialState: GameState = {
    availableCardsToDraw: getCardDeck(),
    player: {
        id: 'realPlayer',
        total_balance: 50,
        total_bet: 0,
        seats: [{
            id: 0,
            card_points: 0,
            cards: [] as Card[],
            bet: 0
        }],
    },
    dealer: {
        cards: [] as Card[],
        card_points: 0
    },
    result: {
        status: null,
        value: 0
    },
    NPC: null,
    total_seats: 1,
    // status: GameStatus.LOADED
    status: GameStatus.DEALING
};

// calc winning bet
// TODO if balance less than 5 don't allow to play

export function gameReducer(state = initialState, action: GameAction): GameState {
    switch(action.type) {

        /* case ActionTypes.START:
            return {
                ... state,
                status: GameStatus.STARTED
            } */
        // break; 

        case ActionTypes.PLACE_BET:
            const { value } = action.payload;
            const newSeatsInfo = [...state.player.seats];
            newSeatsInfo[0] = {
                ...newSeatsInfo[0],
                bet: value
            };
            return {
                ...state,
                player: {
                    ...state.player,
                    total_balance: state.player.total_balance = value,
                    total_bet: state.player.total_bet + value,
                    seats: newSeatsInfo
                },
                status: GameStatus.DEALING
            };
            // TODO get cards for everyone
            // TODO change status
            // return state;
        break;

        case ActionTypes.HIT:
            const { card } = action.payload;
            // TODO get card from availableCards
            // TODO determine what
            const newSeats = state.player.seats;
            const currentCards = newSeats[0].cards;
            const newCards = [...currentCards, card];
            newSeats[0] = {
                ...newSeats[0],
                cards: newCards,
                card_points: calcPoints(newCards)
            };
            return {
                ...state,
                player: {
                    ...state.player,
                    seats: newSeats
                }            
            }
            // calculate card points
        // break;

        // TODO go to another player
        case ActionTypes.STAND:
        // TODO NEXT PLAYER
        // не брать карты
            return {
                ...state,
                status: GameStatus.STARTED
            }
        break;

        case ActionTypes.SURRENDER:
        // TODO отдать половину ставки
        //Если у дилера туз, он автоматически проверяет, нет ли у него блэкджека.
        // Ранняя сдача — игрок решает отдать полставки до того, как дилер проверит, есть ли у него блэкджек
            return {
                ...state,
                // status loser half bet
            }
        break;

        case ActionTypes.INIT:
            return {
                ...state,
                status: GameStatus.WAITING_BETS
            }
        break;

        case ActionTypes.DEALING:
        // TODO get cards for everyone and calculate points
        break;

        case ActionTypes.DOUBLE: 
        //TODO вы удваиваете ставку и получаете еще только одну карту.
        // Обычно удвоение используется, если сумма ваших первых двух карт равна от 8 до 11, а в случае «мягкой руки» — от 12 до 19.
        break;

        case ActionTypes.SPLIT:
        //TODO Сплит делается разведением карт в стороны и повторением первоначальной ставки
        break;

        case ActionTypes.PASS_FURTHER: 
            // find another seat if 2 -> 1
            // make active
        break;

        case ActionTypes.REVEAL:
            // calc win
            // calc lose
            return {
                ...state,
                // status: GameStatus.LOADED
            }
        break;
    }
    // your code here

    return state;
}
