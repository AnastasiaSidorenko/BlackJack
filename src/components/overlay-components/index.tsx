import { ActionTypes, GameState, GameStatus, SizeProps } from '../../types';
import { useDispatch, useSelector } from "react-redux";
import { Container } from '@pixi/react';
import React, { useEffect, useState } from 'react';
import { Loaded } from './loaded';
import { Counter } from './counter';
import { BetSelector } from './bets';
import { offset } from './bets';
import { InfoText } from './infoText';
import { MoveMaker } from './moveMaker';
import { RevealResult } from './reveal';
import { Game } from '../game';
 
export const Overlay:React.FC<SizeProps> = ({...props}) => {
    const status = useSelector((state: GameState) => state.status);

    return (
        <Container position={{x: props.width/2, y: props.height/2}} anchor={0.5}>
            { status === GameStatus.LOADED &&
                <Loaded {...props}/>
            }
            { status === GameStatus.WAITING_BETS && 
                <BetSelector seconds={15} />
            }
            { status === GameStatus.WAITING && 
                <MoveMaker seconds={20} />
            }
            { status === GameStatus.ENDED && 
                <RevealResult {...props} />
            }
        </Container>
    )
}