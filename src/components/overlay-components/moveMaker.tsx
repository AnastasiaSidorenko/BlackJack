import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes, GameState, PositionProps } from "../../types";
import { TextStyle } from 'pixi.js';
import { Counter } from "./counter";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { InfoText } from './infoText';

const selectedFilter = new DropShadowFilter();
selectedFilter.color = 0xffffff;
selectedFilter.quality = 10;
selectedFilter.distance = 3;

export const offset = 50;

export const MoveMaker:React.FC<{seconds: number}> = ({seconds}) => {
    const isDoubled = useSelector((state: GameState) => state.player.is_doubled);
    const dispatch = useDispatch();

    const passMove = () => {
        dispatch({
            type: ActionTypes.REVEAL,
        });
    }

    const handleTimeUp = () => {
        passMove();
    }

    const handleHit = () => {
        dispatch({
            type: ActionTypes.HIT
        })
    }

    const handleStand = () => {
        passMove();
    }

    const handleSurrender = () => {
        dispatch({
            type: ActionTypes.SURRENDER
        });
    }

    const handleDouble = () => {
        dispatch({
            type: ActionTypes.DOUBLE
        });
    }

    return (
        <Container anchor={0.5} sortableChildren>
            <InfoText position={{x: 0, y: -offset }} title='Make your decision'/>
            <Container anchor={0.5} position={{x: 0, y: 0}} sortableChildren>
                <Button
                    text="double"
                    onClick={handleDouble}
                    color={isDoubled ? 0xdedede : 0x4d4d4d}
                    position={{x: -150, y: 0}}
                    symbol="2X"
                    fontSize={30}
                />
                <Button
                    text="hit"
                    onClick={handleHit}
                    color={0x3bc043}
                    position={{x: -50, y: 0}}
                    symbol="+"
                    fontSize={50}
                />
                <Button
                    text="stand"
                    onClick={handleStand}
                    color={0xb53737}
                    position={{x: 50, y: 0}}
                    symbol="-"
                    fontSize={50}
                />
                <Button
                    text="SURRENDER"
                    onClick={handleSurrender}
                    color={0xe5de00}
                    position={{x: 150, y: 0}}
                    symbol={'尸'}
                    fontSize={30}
                />
            </Container>
            <Counter
                position={{x: 0, y: -offset * 2}}
                seconds={seconds}
                onTimeUp={handleTimeUp}
            />
        </Container>
    )
}

interface ButtonProps {
    onClick: () => void;
    color: number;
    text: string;
    symbol: string;
    fontSize: number
}

const Button:React.FC<ButtonProps & PositionProps> = ({onClick, color, text, position, symbol, fontSize}) => {
    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(color);
        g.drawCircle(0, 0, 30);
        g.endFill();
    }, [color]);

    return (
        <Container pointerdown={onClick} interactive position={position} sortableChildren>
            <Graphics draw={draw} zIndex={20}/>
            <Text text={symbol} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: fontSize
                })}
                anchor={0.5}
                zIndex={20}
            />
            <Text text={text.toUpperCase()} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: 14
                })}
                position={{ x: 0, y: 40}} anchor={0.5}
                zIndex={20}
            />
        </Container>
    )
}