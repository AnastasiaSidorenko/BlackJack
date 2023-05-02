import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { cardDeckPositionProps, deltaCoefficient } from './index';
import { GameState, GameStatus, PositionProps } from '../../types';
import { useTick } from "@pixi/react";
import { Card } from "./card";
import { CardPoints } from './cardPoints';

interface dealerCardPlacerProps {
    startAnimation: boolean,
    onAnimationEnd: () => void
}

export const DealerCardPlacer:React.FC<dealerCardPlacerProps & cardDeckPositionProps & PositionProps> = ({cardDeckPosition, position, startAnimation, onAnimationEnd}) => {
    let i = 0;
    const dealer = useSelector((state: GameState) => state.dealer);
    const status = useSelector((state: GameState) => state.status);
    const { cards, card_points } = dealer;

    const isCardPositionsValid = cardDeckPosition.x > 0;

    const finalCoords = {
        visible: {x: position.x - 45, y: position.y},
        hidden: {x: position.x + 45, y: position.y}
    }

    const cardPointsCoords = {
        x: position.x,
        y: position.y - 70
    }

    const [visibleCardX, setVisibleCardX] = useState<number>(cardDeckPosition.x);
    const [visibleCardY, setVisibleCardY] = useState<number>(cardDeckPosition.y);

    const [visibleCardBeenAnimated, setVisibleCardBeenAnimated] = useState(false);
    const [visibleCardBackSided, setVisibleCardBackSided] = useState(true);
    const visibleCardPathCenter = (cardDeckPosition.x + finalCoords.visible.x) / 2;

    const [hiddenCardX, setHiddenCardX] = useState<number>(cardDeckPosition.x);
    const [hiddenCardY, setHiddenCardY] = useState<number>(cardDeckPosition.y);

    useEffect(() => {
        if (isCardPositionsValid) {
            setVisibleCardX(cardDeckPosition.x);
            setHiddenCardX(cardDeckPosition.x);
        }
    }, [isCardPositionsValid]);

    const visibleCardAnimationEnd = isCardPositionsValid && visibleCardX > 0 && visibleCardX <= finalCoords.visible.x;
    const hiddenCardAnimationEnd = isCardPositionsValid && hiddenCardX > 0 && hiddenCardX <= finalCoords.hidden.x;

    useEffect(() => {
        if (hiddenCardAnimationEnd) {
            onAnimationEnd();
        }
    }, [hiddenCardAnimationEnd]);

    useEffect(() => {
        if (visibleCardAnimationEnd) {
            setVisibleCardBeenAnimated(true);
            i = 0;
        }
    }, [visibleCardAnimationEnd]);

    useTick(delta => {
        if (isCardPositionsValid && startAnimation) {
            i += deltaCoefficient * delta;
            if (!visibleCardBeenAnimated) {
                if (visibleCardX > finalCoords.visible.x) {
                    setVisibleCardX(visibleCardX - i);
                }
                if (visibleCardY < finalCoords.visible.y) {
                    setVisibleCardY(visibleCardY + i * 0.1);
                }
                if (visibleCardX < visibleCardPathCenter) {
                    setVisibleCardBackSided(false);
                }
            } else {
                if (hiddenCardX > finalCoords.hidden.x) {
                    setHiddenCardX(hiddenCardX - i);
                }
                if (hiddenCardY < finalCoords.hidden.y) {
                    setHiddenCardY(hiddenCardY + i * 0.1);
                }
            }
        }
    });

    return (
        <>
            { cards.length === 2 &&
                <> 
                    {visibleCardBeenAnimated && <CardPoints points={card_points} position={cardPointsCoords} />}
                    <Card zIndex={5}
                        card={cards[0]}
                        isBack={visibleCardBackSided}
                        position={{x: visibleCardX, y: visibleCardY}}
                    />
                    <Card
                        card={cards[1]}
                        isBack={status !== GameStatus.ENDED}
                        position={{x: hiddenCardX, y: hiddenCardY}}
                    />
                </>
            }
        </>
    )
}