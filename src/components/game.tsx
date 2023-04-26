import { Container, Graphics, SimpleMesh, Sprite, Stage } from "@pixi/react";
import React, { useCallback, useEffect, useState } from "react";
import { Overlay } from './overlay-components/index';
import { SizeProps } from '../types';

// const { uvs, vertices, indices } = makeSimpleMeshData();

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
        g.bezierCurveTo(0, height * 1.1, width, height * 1.1, width, height / 2);
        g.lineTo(width, 0);
        g.lineTo(0, 0);
        g.endFill();
    }, [width, height]);

    const padding = 40;

    const drawInner = useCallback((g: any) => {
        g.clear();
        g.moveTo(padding, 0);
        g.beginFill(0x095525);
        g.lineTo(padding, height / 2);
        g.bezierCurveTo(padding, height, width - padding, height, width - padding, height / 2);
        g.lineTo(width - padding, 0);
        g.lineTo(padding, 0);
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

  return (
        <Container>
            <BackGround {...props }/>
            <Table {...props} />
            <Overlay {...props}  />
            { /* <Players /> */}
        </Container>
  );
};
