import { GameState, SizeProps } from '../../types';
import { useSelector } from "react-redux";
import { Container, Graphics, Text } from '@pixi/react';
import React, { useCallback } from 'react';
import { TextStyle } from 'pixi.js';
 
export const InfoPanel:React.FC<SizeProps> = ({width, height}) => {
    const balance = useSelector((state: GameState) => state.player.total_balance);
    const bet = useSelector((state: GameState) => state.player.total_bet);

    const rectHeight = 70;
    const rectWidth = 180;

    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(0xa17597);
        g.drawRoundedRect(0, 0, rectWidth, rectHeight, 5);
        g.endFill();
    }, [width, height]);

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
                position={{ x:20, y: 10 }}
            />
            <Text text={`Total bet: ${bet}`} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#07181d'], // gradient,
                    fontSize: 20
                })}
                position={{ x: 20, y: 40 }}
            />
        </Container>
    )
}