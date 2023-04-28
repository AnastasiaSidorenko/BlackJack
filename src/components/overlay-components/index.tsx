import { ActionTypes, GameResult, GameState, GameStatus, SizeProps } from '../../types';
import { Provider, ReactReduxContextValue, useDispatch, useSelector } from "react-redux";
import { Container, Graphics } from '@pixi/react';
import React, { useCallback } from 'react';
import { Loaded } from './loaded';
import { Counter } from './counter';
import { BetSelector } from './bets';
import { offset } from './bets';
import { InfoText } from './infoText';
import { Game } from '../game';
 
export const Overlay:React.FC<SizeProps> = ({...props}) => {
    const status = useSelector((state: GameState) => state.status);
    const result = useSelector((state: GameState) => state.result);
    const textPosition={x: 0, y: -offset};

    return (
        <Container position={{x: props.width/2, y: props.height/2}} anchor={0.5}>
            { status === GameStatus.LOADED &&
                <Loaded {...props}/>
            }
            { status === GameStatus.WAITING_BETS && 
                <BetSelector seconds={5} />
            }
            { status === GameStatus.STARTED &&
                <Counter seconds={3} position={{x: 0, y: 0}} />
            }
            {  [GameStatus.STARTED].includes(status) &&
                <InfoText title={'bets accepted'} position={textPosition} />
            }
            { status === GameStatus.WAITING && 
                
            }
            { status === GameStatus.REVEAL && 
                // setTimeout 
                <InfoText
                    title={result.status === GameResult.WIN ? `You won ${result.value}` : `You lost ${result.value}`}
                    position={textPosition}
                />
            }
        </Container>
    )
}