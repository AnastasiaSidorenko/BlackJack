import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import { Stage as PixiStage } from '@pixi/react';
import { ReactReduxContext } from 'react-redux';
import { gameReducer } from './reducers/gameReducer';

import { createRoot } from "react-dom/client";

// the context bridge:
const ContextBridge = ({ children, Context, render }) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
    </Context.Consumer>
  );
};

// your Stage:

export const Stage = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={(children) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
};

const store = createStore(gameReducer, composeWithDevTools());

// your App
function App() {
    return (
        <Stage value={store}>
            <div>TABLE</div>
        </Stage>
    )
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);