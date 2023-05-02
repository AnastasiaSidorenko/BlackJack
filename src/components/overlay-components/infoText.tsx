import React from 'react';
import { TextStyle } from "pixi.js";
import { PositionProps } from "../../types";
import { Text } from "@pixi/react";

export const InfoText:React.FC<{title: string; fontSize?: number} & PositionProps> = ({title, position, fontSize}) => {
    return (
        <Text text={title.toUpperCase()} style={
            new TextStyle({
                align: 'center',
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ['#ffffff'], // gradient,
                fontSize: fontSize || 26
            })}
            anchor={0.5}
            position={position}
            zIndex={20}
        />
    );
}