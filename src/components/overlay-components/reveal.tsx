import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SizeProps, ActionTypes, GameResult, GameState } from "../../types";
import { TextStyle } from 'pixi.js';

export const RevealResult:React.FC<SizeProps> = ({width, height}) => {
    const result = useSelector((state: GameState) => state.result);
    const dispatch = useDispatch();
    const rectWidth = 250;
    const rectHeight = 100;

    const rectRestartWidth = 150;
    const rectRestartHeight = 70;

    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(result.status === GameResult.WIN ? 0x4CAF50 : 0x757575);
        g.drawRoundedRect(0 - rectWidth/2, 0 - rectHeight/2, rectWidth, rectHeight, 15);
        g.endFill();
    }, [width, height]);

    const drawRestart = useCallback((g: any) => {
        g.clear();
        g.beginFill(0x7E57C2);
        g.drawRoundedRect(0 - rectRestartWidth/2, 0 - rectRestartHeight/2, rectRestartWidth, rectRestartHeight, 15);
        g.endFill();
    }, [width, height]);

    const onRestart = () => {
        dispatch({
            type: ActionTypes.RESTART
        });
    }

    return (
        <>
            <Container anchor={0.5}>
                <Graphics draw={draw}/>
                <Text text={result.status === GameResult.WIN ? `You won \n${result.value !== 0 ? result.value : 'your bet (1 to 1)'}` : `You lost \n${result.value}`}
                    style={
                    new TextStyle({
                        align: 'center',
                        fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                        fill: ['#ffffff'], // gradient,
                    })}
                    anchor={0.5}
                />
            </Container>
            <Container pointerdown={onRestart} anchor={0.5} interactive position={{ x: 0, y: rectHeight + 20}}>
                <Graphics draw={drawRestart}/>
                <Text text={'Restart'}
                    style={
                    new TextStyle({
                        align: 'center',
                        fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                        fill: ['#ffffff'], // gradient
                    })}
                    anchor={0.5}
                />
            </Container>
        </>
    )
}