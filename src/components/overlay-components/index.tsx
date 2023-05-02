import { ActionTypes, GameState, GameStatus, SizeProps } from '../../types';
import { useDispatch, useSelector } from "react-redux";
import { Container } from '@pixi/react';
import React from 'react';
import { Loaded } from './loaded';
import { Counter } from './counter';
import { BetSelector } from './bets';
import { offset } from './bets';
import { InfoText } from './infoText';
import { MoveMaker } from './moveMaker';
import { RevealResult } from './reveal';
 
export const Overlay:React.FC<SizeProps> = ({...props}) => {
    const dispatch = useDispatch();
    const status = useSelector((state: GameState) => state.status);
    const textPosition={x: 0, y: -offset};

    const handleStartDealing = () => {
        dispatch({
            type: ActionTypes.DEALING
        });
    }

    return (
        <Container position={{x: props.width/2, y: props.height/2}} anchor={0.5}>
            { status === GameStatus.LOADED &&
                <Loaded {...props}/>
            }
            { status === GameStatus.WAITING_BETS && 
                <BetSelector seconds={5} />
            }
            { status === GameStatus.STARTED &&
                <>
                    <InfoText title={'bets accepted'} position={textPosition} />
                    <Counter seconds={3} position={{x: 0, y: 0}} onTimeUp={handleStartDealing} />
                </>
            }
            { status === GameStatus.WAITING && 
                <MoveMaker seconds={15} />
            }
            { status === GameStatus.ENDED && 
                // setTimeout 
                <RevealResult {...props} />
            }
        </Container>
    )
}