import { localStorageBalance } from './reducers/gameReducer';
import { Card_Deck, Suit, SuitEnum, CardValue, Card, Result, GameResult, GameState, GameStatus } from './types';

export function getCardDeck():Card_Deck  {
    let cardDeck: Card_Deck = [];
    Object.values(SuitEnum).forEach(suit => {
        for(let i = 1; i <= 13; i++) {
            cardDeck.push({
                suit: suit,
                value: i as CardValue
            });
        }
    });
    console.log("cardDeck", cardDeck);
    return shuffleArray(cardDeck);
}

function shuffleArray(array:Card_Deck) {
    console.log("shuffleArray", array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getSum(total:number, card: Card):number {
    const cardPoints = card.value > 10 ? 10 : card.value;
    return total + cardPoints
}

export function calcPoints(cards: Card[]) {
    const cardWithoutAce = cards.filter(card => card.value !== 1);
    const aceQuantity = cards.length - cardWithoutAce.length;
    let pointsResult = cards.reduce(getSum, 0);
    if (aceQuantity) {
        if (pointsResult > 21) {
            pointsResult+= aceQuantity
        } else {
            pointsResult+= aceQuantity * 11;
        }
    }
    return pointsResult;
}

export function isBlackJack(cards: Card[]) {
    return calcPoints(cards) === 21;
}

export function calcDealerShownPoints(card: Card) {
    const { value } = card;
    if (value === 1) return 11;
    if ([11, 12, 13].includes(value)) return 10;
    return value;
}

export function playerSurrenders(player: Card[], bet:number) {
    return getResult(-bet / 2, GameResult.DEFEAT)
}

export function calcGameOutcome(player: Card[], dealer: Card[], bet:number):Result {
    if (isBlackJack(dealer)) {
        if (isBlackJack(player)) {
            return getResult(0, GameResult.WIN);
        } else {
            return getResult(-bet, GameResult.DEFEAT);
        }
    }
    if (isBlackJack(player)) {
        return getResult(bet * 1.5, GameResult.WIN);
    }
    // calculating points of player and dealer
    const playerPoints = calcPoints(player);
    const dealerPoints = calcPoints(dealer);

    if (playerPoints >= dealerPoints) {
        return getResult(0, GameResult.WIN);
    } else {
        return getResult(-bet, GameResult.DEFEAT);
    }
}

function getResult(valueV: number, statusV:GameResult):Result {
    return {
        value: valueV,
        status: statusV
    }
}

export function getStateWithBet(state: GameState, betValue: number): GameState {
    console.log("betValue", betValue);
    console.log("state.player.total_bet", state.player.total_bet);
    // const newSeatInfo = [state.player.seat];
    const allCards = [...state.availableCardsToDraw];
    const drawnCards = allCards.slice(-4);
    console.log("allCards", allCards);
    console.log("drawnCards", drawnCards);
    const playerCards = [drawnCards[0], drawnCards[1]];
    const dealerCards = [drawnCards[2], drawnCards[3]];
    drawnCards.length = drawnCards.length - 4;
    console.log("drawnCards", drawnCards);
    // const newBalanceValue = state.player.total_balance - betValue;
    return {
        ...state,
        player: {
        ...state.player,
        // total_balance: newBalanceValue,
            total_bet: betValue,
            seat: {
                cards: playerCards,
                card_points: calcPoints(playerCards),
            }
        },
        dealer: {
            ...state.dealer,
            cards: dealerCards,
            card_points: calcDealerShownPoints(dealerCards[0])
        },
        status: GameStatus.DEALING
    };
}

export function getStateWithNewCard(state:GameState, doubleBet:boolean = false) {
    console.log("allCards", state.availableCardsToDraw);
    if (doubleBet && state.player.total_balance < state.player.total_bet * 2) return state;
    let availableCards = [...state.availableCardsToDraw];
    const newCard = availableCards.pop();
    availableCards.length-= 1;
    const currentCards = state.player.seat.cards;
    const newCards = [...currentCards, newCard] as Card[];
    const updatedPoints = calcPoints(newCards);
    console.log("availableCards", availableCards);
    console.log("newCard", newCard);
    const newBet = doubleBet ? state.player.total_bet * 2 : state.player.total_bet;
    const newSeat = {
        cards: newCards,
        card_points: updatedPoints
    };
    return {
        ...state,
        availableCardsToDraw: availableCards,
        player: {
            ...state.player,
            seat: newSeat,
            total_bet: newBet
        }            
    }
}

export function getRevealedCardsState(state: GameState) {
    const playerC = [...state.player.seat.cards];
    const dealerC = [...state.dealer.cards];
    const result = calcGameOutcome(playerC, dealerC, state.player.total_bet);
    const newBalance = state.player.total_balance + result.value;
    localStorage.setItem(localStorageBalance, newBalance.toString());
        return {
            ...state,
            player: {
            ...state.player,
                total_balance: newBalance
            },
            dealer: {
                ...state.dealer,
                card_points: calcPoints(state.dealer.cards)
            },
            status: GameStatus.ENDED,
            result: result
        };
}