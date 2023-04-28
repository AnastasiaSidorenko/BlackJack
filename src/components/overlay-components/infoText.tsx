import React, { useCallback } from 'react';
import { TextStyle } from "pixi.js";
import { PositionProps } from "../../types";
import { Text } from "@pixi/react";

export const InfoText:React.FC<{title: string} & PositionProps> = ({title, position}) => {
    return (
    <Text text={title.toUpperCase()} style={
        new TextStyle({
            align: 'center',
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fill: ['#ffffff'], // gradient
        })}
        anchor={0.5}
        position={position}
        />
    );
}