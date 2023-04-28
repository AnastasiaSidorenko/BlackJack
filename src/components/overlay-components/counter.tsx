import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SizeProps, ActionTypes, PositionProps } from "../../types";
import { TextStyle } from 'pixi.js';

interface CounterProps {
    onTimeUp?: () => void;
    seconds: number;
    preTimeUpSeconds?: number;
    onPretimeUp?: () => void;
}

export const Counter:React.FC<CounterProps & PositionProps> = ({position, seconds, onTimeUp, preTimeUpSeconds, onPretimeUp}) => {
    const [ count, setCount ] = useState(seconds);

    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(0x0e8c3d);
        g.drawCircle(0, 0, 30);
        g.endFill();
    }, []);

    const counterValid = count > 0;
    const preTimeUp = count === preTimeUpSeconds;

    useEffect(() => {
        if (!counterValid && onTimeUp) onTimeUp();
        const interval = setInterval(() => {
            console.log("here", count);
            setCount(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [counterValid]);

    useEffect(() => {
        if (preTimeUp && onPretimeUp) onPretimeUp();
    }, [preTimeUp]);

    return (
        counterValid
        ?
        <Container position={position} anchor={0.5}>
            <Graphics draw={draw} />
            <Text text={count.toString()} style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient
                })}
                anchor={0.5}
            />
        </Container>
        : null
    )
}