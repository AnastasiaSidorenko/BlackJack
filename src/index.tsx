import * as React from "react";
import { AnyAction, createStore } from "redux";
import { Provider, ReactReduxContextValue } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import { Stage as PixiStage } from '@pixi/react';
import { ReactReduxContext } from 'react-redux';
import { gameReducer } from './reducers/gameReducer';

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Game } from './components/game';
import './index.css';
interface ContextBridgeProps {
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

function App() {
    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);

    const handleResize = () => {
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