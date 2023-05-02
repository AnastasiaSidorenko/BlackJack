import { Text } from '@pixi/react';
import { TextStyle } from "pixi.js"
import { PositionProps } from "../../types"
import React from "react"

export const CardPoints:React.FC<{points: number} & PositionProps> = ({points, position}) => {
    return (
        <Text
            text={points.toString()}
            style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: 18
                })
            }
            anchor={0.5}
            position={position}
            zIndex={30}
        />
    )
}