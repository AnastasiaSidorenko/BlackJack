import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import React, { useEffect } from "react"
import { useSelector } from "react-redux";
import { GameState, Seat } from "../../types"
import { Card } from "./card";

export const CardPlacers:React.FC = () => {
    return null
}

export const PlayerCardPlacer:React.FC<{seat: Seat}> = ({seat}) => {
    useEffect(() => {
    
    }, []);
    // TODO animation on cards
    // <Container pointerdown={onClick} position={{x: width/2, y: height/2}} anchor={0.5} interactive>
    return (
        <Container>
            <Text text={seat.card_points.toString()} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient
                })}
                anchor={0.5}
            />
        </Container>
    );
}

export const DealerCardPlacer:React.FC = () => {
    const cards = useSelector((state: GameState) => state.dealer.cards);

    return (
        <Container anchor={0.5}>
            { cards.length === 2 &&
                <>
                    <Card card={cards[0]} position={{x: 0, y: 0}} />
                    <Card card={cards[1]} isBack={true} position={{x: 0, y: 0}} />
                </>
             }
        </Container>
    )
    return null
}