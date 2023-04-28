import { ActionTypes, GameResult, GameState, GameStatus, SizeProps } from '../../types';
import { Provider, ReactReduxContextValue, useDispatch, useSelector } from "react-redux";
import { Container, Graphics, Text } from '@pixi/react';
import React, { useCallback } from 'react';
import { TextStyle } from 'pixi.js';
 
export const InfoPanel:React.FC<SizeProps> = ({width, height}) => {
    const balance = useSelector((state: GameState) => state.player.total_balance);
    const bet = useSelector((state: GameState) => state.player.total_bet);

    const rectHeight = 100;
    const rectWidth = 200;

    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(0xa17597);
        g.drawRoundedRect(0, 0, rectWidth, rectHeight, 5);
        g.endFill();
    }, [width, height]);

    console.log("height, width", height, width);
    console.log(height - rectWidth);
    console.log(width - rectHeight);

    return (
        <Container position={{x: 5, y: height - rectHeight -5}}>
            <Graphics draw={draw}/>
            <Text text={`Balance: ${balance}`} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#07181d'], // gradient,
                    fontSize: 20
                })}
                position={{ x:50, y: 25 }}
            />
            <Text text={`Total bet: ${bet}`} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#07181d'], // gradient,
                    fontSize: 20
                })}
                position={{ x: 50, y: 60 }}
            />
        </Container>
    )
}