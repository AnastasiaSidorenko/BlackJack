import React from "react";
import { Card } from "./card";

export const CardDeckPlacer:React.FC = () => {
    const cards = [];

    for(let i = 0; i < 8; i++) {
        cards.push(
            <Card
                isBack={true}
                position={{ x: - i * 2, y: i * 2 }}
                key={i}
                zIndex={9 - i}
            />
        );
    }   

    return (
        <>
            {cards}
        </>
    );
}