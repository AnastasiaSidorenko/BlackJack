import React, { useCallback, useEffect } from 'react';
import { Container, Sprite, withFilters } from '@pixi/react';
import { Filter, filters } from 'pixi.js';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';
import { PositionProps } from '../../types';

interface CoinProps {
    bet: number,
    isSelected: boolean,
    onSelect: (bet: number) => void
}

const path = '../../assets/Coins/';

const filter = new DropShadowFilter();
filter.color = 0xffffff

export const Coin:React.FC<CoinProps & PositionProps> = ({bet, position, isSelected, onSelect}) => {
    return (
        <Sprite
            image={`${path}${bet}.png`}
            position={position || {x: 0, y:0}}
            scale={0.5}
            interactive
            onclick={() => onSelect(bet)}
            anchor={0.5}
        />
    )
};