import { BingoAction, BingoState, BingoTicket } from "../types";
import { isEqual, uniq } from "lodash";

const initialState: BingoState = {
    /* players: [],
    numbersDrawn: [],
    winners: [],
    availableNumbersToDraw: Array.from({length: 75}, (_, i) => i + 1) */
};
export function gameReducer(state = initialState, action: BingoAction): BingoState {
    switch(action.type) {

        case "registered":
            if (true) return { ...state };
        break; 
    }
    // your code here

    return state;
}
