import { ActionTypes, GameState, GameStatus, SizeProps } from '../../types';
import { Provider, ReactReduxContextValue, useDispatch, useSelector } from "react-redux";
import { Container, Graphics } from '@pixi/react';
import React, { useCallback } from 'react';
import { Loaded } from './loaded';
import { Counter } from './counter';

export const Overlay:React.FC<SizeProps> = ({...props}) => {
    const status = useSelector((state: GameState) => state.status);
    return (
        <Container>
            { status === GameStatus.LOADED &&
                <Loaded {...props}/>
            }
            { status === GameStatus.WAITING_BETS && null }
            { status === GameStatus.STARTED &&
                <Counter seconds={3} {...props} />
            }
            { status === GameStatus.WAITING && null}
            { status === GameStatus.ENDED && null }
        </Container>
    )
}