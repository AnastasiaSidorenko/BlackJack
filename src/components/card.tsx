import { Sprite } from '@pixi/react';
import { Card } from '../types';


interface CardProps {
    card: Card;
    isBack?: boolean;
    position: [number, number]
}

const path = '../assets/Cards/';

const Card:React.FC<CardProps> = ({isBack, card, position}) => (
    <Sprite
        image={isBack ? `${path}back/card_back.png` : `${path}${card.suit}/${card.value}_${card.suit}.png`}
        position={position}
        roundPixels={true}
        // filters={[blurFilter, matrixFilter]}
    />
);