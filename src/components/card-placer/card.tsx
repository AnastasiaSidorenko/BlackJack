import { Sprite } from '@pixi/react';
import React, { ForwardedRef, Ref, RefObject } from 'react';
import { Card as CardType } from '../../types';
import { PositionProps } from '../../types';

interface CardProps {
    card?: CardType;
    isBack?: boolean;
    animationDelay?: number;
    zIndex?: number;
   //  motion: {x: number, y: number, rotation: number}
}

const path = '../assets/Cards/';

export const Card:React.FC<CardProps & PositionProps> = ({isBack, card, position, zIndex}) => (
    <Sprite
        image={isBack ? `${path}back/card_back.png` : `${path}${card!.suit}/${card!.value}_${card!.suit}.png`}
        position={position}
        roundPixels={true}
        anchor={0.5}
        scale={0.8}
        zIndex={zIndex || 1}
        // motion={motion}
        // TODO filters={[blurFilter, matrixFilter]}
    />
);