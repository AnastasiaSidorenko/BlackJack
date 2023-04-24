import * as React from "react";
import { AnyAction, createStore, Store } from "redux";
import { Provider, ReactReduxContextValue, useSelector } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import { Stage as PixiStage } from '@pixi/react';
import { ReactReduxContext } from 'react-redux';
import { gameReducer } from './reducers/gameReducer';

import { createRoot } from "react-dom/client";
import { values } from "lodash";
import { GameAction, GameState } from "./types";
import { StrictMode } from "react";
import { Game } from './components/game';
import './index.css';
interface ContextBridgeProps {
    // value: Store<GameState, GameAction>
    Context: React.Context<ReactReduxContextValue<any, AnyAction>>;
    children: React.ReactNode;
    render: any
}

// the context bridge:
const ContextBridge:React.FC <ContextBridgeProps> = ({ children, Context, render }) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
    </Context.Consumer>
  );
};

const store = createStore(gameReducer, composeWithDevTools());

// your Stage:
interface StageProps {
    children: React.ReactNode;
    width: number;
    height: number;
}

export const Stage:React.FC <StageProps> = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={(children: React.ReactNode) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
};

const Table = () => {
    console.log("HERE");
    const name = useSelector((state: GameState) => state.name);
    console.log({name});
    return null;
    /* return (
        <div>Table: {name}</div>
    ) */
}

// your App
function App() {
    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    React.useEffect(() => {
        console.log("window", window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);

    const handleResize = () => {
      console.log("resize");
      setWidth(document.body.clientWidth);
      setHeight(window.innerHeight);
    };

    return (
      <StrictMode>
        <Provider store={store}>
          <Stage width={width} height={height}>
            <Game width={width} height={height} />
          </Stage>
        </Provider>
      </StrictMode>
    )
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);