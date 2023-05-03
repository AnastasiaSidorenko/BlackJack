import { Container, Graphics, Text } from "@pixi/react";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SizeProps, ActionTypes, GameState } from "../../types";
import { TextStyle } from 'pixi.js';
import { InfoText } from "./infoText";

export const Loaded:React.FC<SizeProps> = ({width, height}) => {
    const balance = useSelector((state: GameState) => state.player.total_balance);
    const dispatch = useDispatch();
    const rectWidth = 200;
    const rectHeight = 100;

    const isBalanceValid = balance >= 5;

    const draw = useCallback((g: any) => {
        g.clear();
        g.beginFill(0x0e8c3d);
        g.drawRoundedRect(0 - rectWidth/2, 0 - rectHeight/2, rectWidth, rectHeight, 15);
        g.endFill();
    }, [width, height]);

    const onClick = () => {
        dispatch({
            type: ActionTypes.INIT
        });
    }

    return (
        <Container pointerdown={isBalanceValid ? onClick : () => {}} anchor={0.5} interactive>
            {isBalanceValid
                ? <>
                    <Graphics draw={draw}/>
                    <Text text={"READY?"} style={
                        new TextStyle({
                            align: 'center',
                            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                            fill: ['#ffffff'], // gradient
                        })}
                        anchor={0.5}
                    />
                </>
                : <InfoText title={"Balance is too low\nReload page"} position={{x: 0, y: 0}} />
            }
        </Container>
    )
}