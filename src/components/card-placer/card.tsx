import { Sprite } from '@pixi/react';
import React from 'react';
import { Card as CardType } from '../../types';
import { PositionProps } from '../../types';

interface CardProps {
    card: CardType;
    isBack?: boolean;
    animationDelay?: number;
}

const path = '../assets/Cards/';

export const Card:React.FC<CardProps & PositionProps> = ({isBack, card, position}) => (
    <Sprite
        image={isBack ? `${path}back/card_back.png` : `${path}${card.suit}/${card.value}_${card.suit}.png`}
        position={position}
        roundPixels={true}
        // TODO filters={[blurFilter, matrixFilter]}
    />
);