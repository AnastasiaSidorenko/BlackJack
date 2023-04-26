import { Card_Deck, Suit, SuitEnum, CardValue, Card } from './types';

export function getCardDeck():Card_Deck  {
    const cardDeck: Card_Deck = [];
    Object.values(SuitEnum).forEach(suit => {
        for (let i = 0; i++; i <= 13) {
            cardDeck.push({
                suit: suit,
                value: i as CardValue
            })
        }
    });

    console.log({cardDeck});
    console.log("shuffleArray(cardDeck)", shuffleArray(cardDeck));
    return shuffleArray(cardDeck);
}

function shuffleArray(array:Card_Deck) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
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
