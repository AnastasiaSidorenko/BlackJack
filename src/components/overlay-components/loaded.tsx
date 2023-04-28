import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { SizeProps, ActionTypes } from "../../types";
import { TextStyle } from 'pixi.js';

export const Loaded:React.FC<SizeProps> = ({width, height}) => {
    const dispatch = useDispatch();
    const rectWidth = 200;
    const rectHeight = 100;

    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(0x0e8c3d);
        g.drawRoundedRect(0 - rectWidth/2, 0 - rectHeight/2, rectWidth, rectHeight, 15);
        // g.drawRoundedRect(0, 0, rectWidth, rectHeight, 15);
        g.endFill();
    }, [width, height]);

    const onClick = () => {
        console.log("here");
        dispatch({
            type: ActionTypes.INIT
        });
    }

    // position={{x: width/2, y: height/2}} anchor={0.5}

    return (
        <Container pointerdown={onClick} anchor={0.5} interactive>
            <Graphics draw={draw}/>
            <Text text="READY" style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient
                })}
                anchor={0.5}
            />
        </Container>
    )
}