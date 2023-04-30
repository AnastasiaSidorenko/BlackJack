import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SizeProps, ActionTypes, PositionProps, GameState } from "../../types";
import { TextStyle } from 'pixi.js';
import { Coin } from './coin';
import { Counter } from "./counter";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { update } from "lodash";
import { InfoText } from './infoText';

const bets = [1, 5, 10, 25, 100, 500];

const selectedFilter = new DropShadowFilter();
selectedFilter.color = 0xffffff;
selectedFilter.quality = 10;
selectedFilter.distance = 3;

const step = 35;
export const offset = 70;

const defaultBet = 5;


// SizeProps & 
export const MoveMaker:React.FC<{seconds: number}> = ({seconds}) => {
    // const balance = useSelector((state: GameState) => state.player.total_balance);

    const [ title, setTitle ] = useState('Make your decision');

    const dispatch = useDispatch();

    const elementsPositions = [
        {x: -step, y: 0},
        {x: step, y: 0},
    ];

    const passMove = () => {
        dispatch({
            type: ActionTypes.PASS_FURTHER,
        });
    }

    const handleTimeUp = () => {
        passMove();
        //TODO pass to another player
    }

    const handleHit = () => {
        dispatch({
            type: ActionTypes.HIT
        })
    }

    const handleStand = () => {
        passMove();
    }

    // position={{x: width/2, y: height/2}} anchor={0.5}
    return (
        <Container anchor={0.5} >
            <InfoText position={{x: 0, y: -offset}} title={title} />
            <Container anchor={0.5} position={{x: 0, y: 0}}>
                <Button
                    text="HIT"
                    onClick={handleHit}
                    color={0x3bc043}
                    position={{x: -50, y: 0}}
                    symbol="+"
                />
                <Button
                    text="STAND"
                    onClick={handleStand}
                    color={0xb53737}
                    position={{x: 50, y: 0}}
                    symbol="-"
                />
            </Container>
            <Counter
                position={{x: 0, y: -offset * 2}}
                seconds={20}
                onTimeUp={handleTimeUp}
            />
            {/* */}
            {/*TODO error if balance less than bets */}
        </Container>
    )
}

interface ButtonProps {
    onClick: () => void;
    color: number;
    text: string;
    symbol: string
}

const Button:React.FC<ButtonProps & PositionProps> = ({onClick, color, text, position, symbol}) => {
    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(color);
        g.drawCircle(0, 0, 30);
        g.endFill();
    }, []);

    return (
        <Container pointerdown={onClick} interactive position={position}>
            <Graphics draw={draw}/>
            <Text text={symbol} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: 50
                })}
                anchor={0.5}
            />
            <Text text={text} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: 14
                })}
                position={{ x: 0, y: 40}} anchor={0.5}
            />
        </Container>
    )
}