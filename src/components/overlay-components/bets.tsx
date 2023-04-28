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
export const BetSelector:React.FC<{seconds: number}> = ({seconds}) => {
    const balance = useSelector((state: GameState) => state.player.total_balance);

    const [ title, setTitle ] = useState('Place your bets');
    const [ selectedBet, setSelectedBet ] = useState(5);
    const [ doubled, setDoubled ] = useState(0);
    const [ error, setError ] = useState('');

    const dispatch = useDispatch();

    const calcResultValue = (bet: number, doubledByTimes: number) => {
        console.log("bet", bet);
        return doubledByTimes > 0 ? bet * (doubledByTimes * 2) : bet;
    }

    const onSelectBetHandler = (betValue: number) => {
        console.log("onSelectBetHandler");
        if (checkIfBetValid(betValue)) {
            setSelectedBet(betValue);
            resetDoubled();
        }
    }

    const handleOnDouble = () => {
        console.log("handleOnDouble");
        const resValue = calcResultValue(selectedBet, doubled + 1);
        if (checkIfBetValid(selectedBet, doubled + 1)) {
            if (bets.includes(resValue)) {
                setSelectedBet(resValue);
            } else {
                setDoubled(prev => prev + 1);
            }
        }
    }

    const handleUndo = () => {
        console.log("handleUndo");
        setSelectedBet(defaultBet);
        resetDoubled();
    }

    const resetDoubled = () => {
        setDoubled(0)
    }

    const checkIfBetValid = (betV: number, doubledV = doubled) => {
        console.log("balance", balance);
        console.log("calcResultValue({bet: bet, doubledByTimes: doubledV}) <= balance;", calcResultValue(betV, doubledV));
        const isValid =  calcResultValue(betV, doubledV) <= balance;
        if (isValid) {
            setError('');
        } else {
            setError('Unsufficient balance');
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
                value: calcResultValue(selectedBet, doubled)
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

    console.log({selectedBet});
    console.log({doubled});

    // position={{x: width/2, y: height/2}} anchor={0.5}
    return (
        <Container anchor={0.5} >
            <InfoText position={{x: 0, y: -offset}} title={title} />
            {/* <Undo onClick={handleUndo} /> */}
            {// bets map over
                bets.map((betValue, index) => {
                const isSelected= selectedBet === betValue;
                const coin = 
                <Coin
                    bet={betValue}
                    isSelected={selectedBet === betValue}
                    onSelect={onSelectBetHandler}
                    position={coinPositions[index]}
                />

                if (isSelected) {
                    return (
                        <Container filters={[selectedFilter]}>
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
                seconds={20}
                onTimeUp={handleTimeUp}
                preTimeUpSeconds={5}
                onPretimeUp={handleBetsClosing}
            />
            {/* */}
            {/*TODO error if balance less than bets */}
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