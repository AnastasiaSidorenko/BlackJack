import { Container } from "@pixi/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes, GameState, SizeProps } from "../../types"
import { DealerCardPlacer } from './dealerCardPlacer';
import { CardDeckPlacer } from './cardDeckPlacer';
import { PlayerCardPlacer } from './playerCardPlacer';

export const deltaCoefficient = 8;

export interface cardDeckPositionProps {
    cardDeckPosition: {
        x: number;
        y: number
    }
}

export const CardPlacers:React.FC<SizeProps> = ({width, height}) => {
    const player = useSelector((state: GameState) => state.player);

    const dispatch = useDispatch();

    const getCardDeckPlacerPosition = () => ({x: width - 80, y: 60 });
    const [startDealerCardsAnimation, setStartDealerCardsAnimation] = useState(false);
    let CardDeckPlacerPosition = getCardDeckPlacerPosition();

    useEffect(() => {
        CardDeckPlacerPosition = getCardDeckPlacerPosition();
    }, [width, height]);

    const handleDealerCardAnimationEnd = () => {
        handleGoToNextStep();
    }

    const handlePlayerCardsBeenAnimated = () => {
        setStartDealerCardsAnimation(true);
    }

    const handleGoToNextStep = () => {
        setTimeout(() => {
            dispatch({
                type: ActionTypes.WAIT_FOR_MOVE
            });
        }, 1000);
    }

    return (
        <Container sortableChildren>

             <Container position={CardDeckPlacerPosition} anchor={0.5} sortableChildren zIndex={1}>
                {<CardDeckPlacer />}
             </Container>

             <Container anchor={0.5} sortableChildren zIndex={2}> 
                <DealerCardPlacer
                    cardDeckPosition={CardDeckPlacerPosition}
                    position={{ x: width / 2, y: 90 }}
                    startAnimation={startDealerCardsAnimation}
                    onAnimationEnd={handleDealerCardAnimationEnd}
                />
            </Container>

            <Container sortableChildren anchor={0.5}>
                <PlayerCardPlacer
                    cardDeckPosition={CardDeckPlacerPosition}
                    seat={player.seat}
                    position={{ x: width / 2, y: height - 150 }}
                    on2CardsAnimationEnd={handlePlayerCardsBeenAnimated}
                />
            </Container>
        </Container>
    );
}