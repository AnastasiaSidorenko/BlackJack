import { Container, Graphics, Sprite } from "@pixi/react";
import React, { useCallback } from "react";
import { Overlay } from './overlay-components/index';
import { GameState, GameStatus, SizeProps } from '../types';
import { useSelector } from "react-redux";
import { CardPlacers } from './card-placer';
import { InfoPanel } from './info-panel/index';

// const { uvs, vertices, indices } = makeSimpleMeshData();
export const tablePadding = 40;

const BackGround:React.FC<SizeProps> = ({width, height}) => {
    return (
        <Sprite
            image={'./assets/background.png'}
            x={0}
            y={0}
            width={width}
            height={height}
        />
    );
};

export const Table:React.FC<SizeProps> = ({ width, height }) => {
    const drawOuter = useCallback((g: any) => {
        g.clear();
        g.moveTo(0, 0);
        g.beginFill(0x555555);
        g.lineTo(0, height / 2);
        g.bezierCurveTo(0, height * 1.2, width, height * 1.2, width, height / 2);
        g.lineTo(width, 0);
        g.lineTo(0, 0);
        g.endFill();
    }, [width, height]);


    const drawInner = useCallback((g: any) => {
        g.clear();
        g.moveTo(tablePadding, 0);
        g.beginFill(0x095525);
        g.lineTo(tablePadding, height / 2);
        g.bezierCurveTo(tablePadding, height * 1.1, width - tablePadding, height * 1.1, width - tablePadding, height / 2);
        g.lineTo(width - tablePadding, 0);
        g.lineTo(tablePadding, 0);
        g.endFill();
    }, [width, height]);

    return (
        <>
            <Graphics draw={drawOuter} />
            <Graphics draw={drawInner} />
        </>
    );
}

export const Game:React.FC<SizeProps> = ({ ...props }) => {
    const status = useSelector((state: GameState) => state.status);
    return (
        <Container>
            <BackGround {...props }/>
            <Table {...props} />
            { ![GameStatus.LOADED, GameStatus.WAITING_BETS].includes(status) &&
               <CardPlacers {...props} />  
            }
            <Overlay {...props}  />
            <InfoPanel {...props} />
        </Container>
  );
};
