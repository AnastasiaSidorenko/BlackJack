import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SizeProps, ActionTypes } from "../../types";
import { TextStyle } from 'pixi.js';
import { Coin } from './coin';

const bets = [1, 5, 10, 25, 100, 500];

export const Counter:React.FC<SizeProps & {seconds: number}> = ({width, height, seconds}) => {
    const [ selectedBet, setSelectedBet ] = useState(5);
    const [ doubled, setDoubled ] = useState(0);

    const dispatch = useDispatch();

    const onSelectBetHandler = (betValue: number) => {
        setSelectedBet(betValue);
    }

    const onDouble = () => {
        // const status = useSelector((state: GameState) => state.status); 
        // if balance less than bet - doesn't allow
        setDoubled(prev => prev + 1);
    }

    const Undo = () => {
        setSelectedBet(5);
        setDoubled(0);
    }

    const onTimeUp = () => {
        const resValue = doubled > 0 ? selectedBet : selectedBet * (doubled * 2);
        dispatch({
            type: ActionTypes.PLACE_BET,
            payload: {
                value: resValue
            }
        });
    }

    return (
        <Container position={{x: width/2, y: height/2}} anchor={0.5}>
            <Text text="Place your bets" style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient
                })}
                anchor={0.5}
            />
            {/* undo */}
            {// bets map over
                bets.map((betValue, index) => {
                return (
                    <Coin bet={betValue} isSelected={selectedBet === betValue} onSelect={onSelectBetHandler} />
                )})
            }
            {/* double */}
            <Counter width={width} height={height} seconds={20} />
        </Container>
    )
}

const Undo:React.FC = () => {
    // Text
    // Graphics
}

const Double:React.FC = () => {
    //  Graphics 
    // Text
}