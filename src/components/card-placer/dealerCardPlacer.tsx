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

    const getFinalCoords = () => ({
        visible: {x: position.x - 40, y: position.y},
        hidden: {x: position.x + 40, y: position.y}
    });

    let finalCoords = getFinalCoords();

    const updateCoords = () => {
        setVisibleCardX(cardDeckPosition.x);
        setHiddenCardX(cardDeckPosition.x);
        setVisibleCardY(cardDeckPosition.y);
        setHiddenCardY(cardDeckPosition.y);

        finalCoords = getFinalCoords();
    }

    useEffect(() => {
        updateCoords();
    }, [position, cardDeckPosition]);

    const [visibleCardX, setVisibleCardX] = useState<number>(cardDeckPosition.x);
    const [visibleCardY, setVisibleCardY] = useState<number>(cardDeckPosition.y);

    const [visibleCardBeenAnimated, setVisibleCardBeenAnimated] = useState(false);
    const [visibleCardBackSided, setVisibleCardBackSided] = useState(true);
    const visibleCardPathCenter = (cardDeckPosition.x + finalCoords.visible.x) / 2;

    const [hiddenCardX, setHiddenCardX] = useState<number>(cardDeckPosition.x);
    const [hiddenCardY, setHiddenCardY] = useState<number>(cardDeckPosition.y);
    const [hiddenCardBeenAnimated, setHiddenCardBeenAnimated] = useState(false);

    useEffect(() => {
        if (isCardPositionsValid) {
            updateCoords();
        }
    }, [isCardPositionsValid]);

    const visibleCardAnimationEnd = isCardPositionsValid && visibleCardX > 0 && visibleCardX <= finalCoords.visible.x;
    const hiddenCardAnimationEnd = visibleCardBeenAnimated && isCardPositionsValid && hiddenCardX > 0 && hiddenCardX <= finalCoords.hidden.x;

    useEffect(() => {
        if (hiddenCardAnimationEnd && !hiddenCardBeenAnimated) {
            onAnimationEnd();
            setHiddenCardBeenAnimated(true);
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
            { cards.length >= 2 &&
                <> 
                    {visibleCardBeenAnimated && <CardPoints points={card_points} position={{x: position.x,  y: position.y - 70}} />}
                    <Card
                        zIndex={5}
                        card={cards[0]}
                        isBack={visibleCardBackSided}
                        position={!visibleCardBeenAnimated ? {x: visibleCardX, y: visibleCardY} : finalCoords.visible}
                    />
                    <Card
                        zIndex={5}
                        card={cards[1]}
                        isBack={status !== GameStatus.ENDED}
                        position={!hiddenCardBeenAnimated ? {x: hiddenCardX, y: hiddenCardY} : finalCoords.hidden}
                    />
                    {cards.slice(2, cards.length - 1).map((card, idx) => (
                            <Card
                                zIndex={6 + idx}
                                card={card}
                                position={{ x: finalCoords.hidden.x + 20 *( idx + 1), y: finalCoords.hidden.y + 25 *( idx + 1)}}
                        />
                    ))}
                </>
            }
        </>
    )
}