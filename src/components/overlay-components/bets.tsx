import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SizeProps, ActionTypes, PositionProps, GameState } from "../../types";
import { TextStyle } from 'pixi.js';
import { Coin } from './coin';
import { Counter } from "./counter";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
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
export const BetSelector:React.FC<{seconds:number}> = ({seconds}) => {
    const balance = useSelector((state: GameState) => state.player.total_balance);

    const [ title, setTitle ] = useState('Place your bets');
    const [ selectedBet, setSelectedBet ] = useState(5);
    const [ doubled, setDoubled ] = useState(0);
    const [ totalBet, setTotalBet ] = useState(defaultBet);
    const [ error, setError ] = useState('');

    const dispatch = useDispatch();

    const calcResultValue = (selectedBetValue: number, doubledByTimes: number) => {
        return doubledByTimes > 0 ? selectedBetValue * (doubledByTimes * 2) : selectedBetValue;
    }

    const onSelectBetHandler = (betValue: number) => {
        if (betValue !== selectedBet && checkIfBetValid(betValue, 0)) {
            setSelectedBet(betValue);
            resetDoubled();
            setTotalBet(betValue);
        }
    }

    const handleOnDouble = () => {
        if (checkIfBetValid(selectedBet, doubled + 1)) {
            const resValue = calcResultValue(selectedBet, doubled + 1);
            if (bets.includes(resValue)) {
                setSelectedBet(resValue);
            } else {
                setDoubled(prev => prev + 1);
            }
            setTotalBet(resValue);
        }
    }

    const handleUndo = () => {
        setSelectedBet(defaultBet);
        resetDoubled();
        setTotalBet(defaultBet);
        checkIfBetValid(defaultBet, doubled);
    }

    const resetDoubled = () => {
        setDoubled(0);
        setTotalBet(selectedBet);
        checkIfBetValid(defaultBet, doubled);
    }

    const checkIfBetValid = (betV: number, doubledV:number) => {
        const isValid = calcResultValue(betV, doubledV) <= balance;
        if (isValid) {
            setError('');
        } else {
            setError('Unsufficient balance for bet');
        }
        return isValid;
    }

    const handleBetsClosing = () => {
        setTitle('bets are closing');
    }

    const handleTimeUp = () => {
        setTitle('bets closed');
        dispatch({
            type: ActionTypes.PLACE_BET,
            payload: {
                value: totalBet
            }
        });
    }

    const coinPositions = [
        {x: -step * 5, y: 0},
        {x: -step * 3, y: 0},
        {x: -step, y: 0},
        {x: step, y: 0},
        {x: step * 3, y: 0},
        {x: step * 5, y: 0},
    ];

    return (
        <Container anchor={0.5} >
            <InfoText position={{x: 0, y: -offset}} title={title} />
            {
                bets.map((betValue, index) => {
                    const isSelected= selectedBet === betValue;
                    const coin = (
                        <Coin
                            key={`${betValue}`}
                            bet={betValue}
                            isSelected={selectedBet === betValue}
                            onSelect={onSelectBetHandler}
                            position={coinPositions[index]}
                        />
                    );

                    if (isSelected) {
                        return (
                            <Container filters={[selectedFilter]} key={`${betValue}`}>
                                {coin}
                            </Container>
                        )
                    }
                return coin;
            })}
            <Container anchor={0.5} position={{x: 0, y: offset}}>
                <Button
                    text="UNDO"
                    onClick={handleUndo}
                    color={0x808080}
                    width={80}
                    height={30}
                    position={{x: -50, y: 0}}
                />
                <Button
                    text="DOUBLE"
                    onClick={handleOnDouble}
                    color={0x00000}
                    width={80}
                    height={30}
                    position={{x: 50, y: 0}}
                />
            </Container>
            <Counter
                position={{x: 0, y: offset * 2}}
                seconds={seconds}
                onTimeUp={handleTimeUp}
                preTimeUpSeconds={5}
                onPretimeUp={handleBetsClosing}
            />
            <InfoText title={`total bet: ${totalBet}`} position={{x: 0, y: offset * 3}} fontSize={20} />
            <InfoText title={error} position={{x: 0, y: offset * 3.5}} fontSize={20} />
        </Container>
    )
}

interface ButtonProps {
    onClick: () => void;
    color: number;
    text: string
}

const Button:React.FC<ButtonProps & SizeProps & PositionProps> = ({onClick, width, height, color, text, position}) => {
    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(color);
        g.drawRoundedRect(0 - width/2, 0 - height/2, width, height, 5);
        g.endFill();
    }, []);

    return (
        <Container pointerdown={onClick} interactive position={position}>
            <Graphics draw={draw}/>
            <Text text={text} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: 14
                })}
                anchor={0.5}
            />
        </Container>
    )
}