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

interface ContextBridgeProps {
    value: Store<GameState, GameAction>
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
}

export const Stage:React.FC <StageProps> = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      value={store}
      render={(children: React.ReactNode) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
};

const Table = () => {
    const name = useSelector((state: GameState) => state.name);
    return (
        <div>Table: {name}</div>
    )
}

// your App
function App() {
    return (
        <Stage>
            <Table />
        </Stage>
    )
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);