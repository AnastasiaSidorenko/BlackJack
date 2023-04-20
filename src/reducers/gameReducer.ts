import { GameAction, GameState, BingoTicket } from "../types";
import { isEqual, uniq } from "lodash";

const initialState: GameState = {
    name: "Pavel"
};

export function gameReducer(state = initialState, action: GameAction): GameState {
    switch(action.type) {

        case "registered":
            if (true) return { ...state };
        break; 
    }
    // your code here

    return state;
}
