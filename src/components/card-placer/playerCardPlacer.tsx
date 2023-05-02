import { useTick } from "@pixi/react";
import React, { useState, useEffect } from "react";
import { cardDeckPositionProps, deltaCoefficient } from ".";
import { PositionProps, PositionType, Seat, Card as CardType } from '../../types'; 
import { Card } from "./card";
import { CardPoints } from './cardPoints';

const playerCardXOffset = 30;
const playerCardYOffset = 20;

export interface playerCardPlacerProps {
    cardDeckPosition: {
        x: number;
        y: number
    },
    on2CardsAnimationEnd: () => void;
    seat: Seat
}

export const PlayerCardPlacer:React.FC<playerCardPlacerProps & cardDeckPositionProps & PositionProps> = ({cardDeckPosition, seat, position, on2CardsAnimationEnd}) => {
    const { card_points, cards } = seat;

    const isCardPositionsValid = cardDeckPosition.x > 0;

    const [finalCoords, setFinalCoords] = useState<Array<PositionType>>([] as PositionType[]);
    const [cardsCurrentPositions, setCardsCurrentPositions] = useState<Array<PositionType>>([] as PositionType[]);

    const [lastAnimatedCard, setLastAnimatedCard] = useState<number>(-1);
    const [lastCardsQ, setLastCardsQ] = useState<number>(0);

    useEffect(() => {
        if (isCardPositionsValid) {
            setFinalCoords([getFinalPosition(0), getFinalPosition(1)]);
            setCardsCurrentPositions([cardDeckPosition, cardDeckPosition]);
        }
    }, [isCardPositionsValid]);

    const getFinalPosition = (idx: number) => {
        return {
            x: position.x + idx * playerCardXOffset,
            y: position.y - idx * playerCardYOffset
        }
    }

    const handleCardBeenAnimated = (idx: number) => {
        setLastAnimatedCard(idx);
        if (idx + 1 === 2) {
            on2CardsAnimationEnd();
        }
    }

    useEffect(() => {
        if (cards.length > 2 && cards.length > lastCardsQ) {
            const newCardsQ = cards.length - (lastCardsQ);
            const newFinalPositions:PositionType[] = [];
            const newCurrentPositions:PositionType[] = [];
            for(let i = 0; i < newCardsQ; i++) {
                newFinalPositions.push(getFinalPosition(cards.length - 1 - i));
                newCurrentPositions.push(cardDeckPosition);
            }
            setFinalCoords(prev => [...prev, ...newFinalPositions]);
            setCardsCurrentPositions(prev => [...prev, ...newCurrentPositions]);
        }
        setLastCardsQ(cards.length);
    }, [cards.length]);

    // <Container pointerdown={onClick} position={{x: width/2, y: height/2}} anchor={0.5} interactive>
    return (
        <>
            {isCardPositionsValid && cards.map((card, idx) => {
                if (cardsCurrentPositions[idx]) {
                    console.log("idx", idx);
                    return (
                        <AnimatedCard
                            key={`${card.suit}-${card.value}-${idx + 1}`}
                            card={card}
                            idx={idx}
                            startPosition={cardsCurrentPositions[idx]}
                            onAnimationEnd={handleCardBeenAnimated}
                            finalPosition={finalCoords[idx]}
                            zIndex={idx + 1}
                            startAnimation={idx === lastAnimatedCard + 1}
                        />
                    );
                }
            })}
            {(lastAnimatedCard + 1 >= 2) && <CardPoints points={card_points} position={{ x: position.x, y: position.y + 70}}/> }
        </>
    );
}

interface AnimatedCardProps {
    idx: number,
    startPosition: PositionType,
    finalPosition: PositionType,
    card: CardType,
    // isStartPositionValid: boolean,
    zIndex: number,
    onAnimationEnd: (idx: number) => void,
    startAnimation: boolean
};

const AnimatedCard:React.FC<AnimatedCardProps> = ({idx, startPosition, finalPosition, card, zIndex, onAnimationEnd, startAnimation}) => {
    const [CardX, setCardX] = useState<number>(startPosition.x);
    const [CardY, setCardY] = useState<number>(startPosition.y);
    const [CardXPathCenter, setCardXPathCenter] = useState<number>((startPosition.x + finalPosition.x) / 2);
    const [isBackSided, setIsBackSided] = useState<boolean>(true);
    const [isCardBeenAnimated, setIsCardBeenAnimated] = useState<boolean>(false);
    let i = 0;

    useTick((delta) => {
        if (startAnimation && !isCardBeenAnimated && CardX && CardY) {
            i += deltaCoefficient * delta;
            const XHasntReachedDest = CardX > finalPosition.x;
            const YHasntReachedDes = CardY < finalPosition.y;
            if (XHasntReachedDest || YHasntReachedDes) {
                if (XHasntReachedDest) {
                    setCardX(prev => prev! - i);
                }
                if (YHasntReachedDes) {
                    setCardY(prev => prev! + i * 0.7);
                }
                if (CardX < CardXPathCenter!) {
                    setIsBackSided(false);
                }
            }
            if (CardX <= finalPosition.x && CardY >= finalPosition.y) {
                setIsCardBeenAnimated(true);
                onAnimationEnd(idx);
            }
        }
    });

    return (
        <>
            {(CardX && CardY) && <Card
                key={`${card.suit}-${card.value}-${zIndex}`}
                card={card}
                isBack={isBackSided}
                position={{x: CardX, y: CardY}}
                zIndex={zIndex}
                />
            }
        </>
    )
}