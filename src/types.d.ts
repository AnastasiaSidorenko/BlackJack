export type NumberIn1stCol = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type NumberIn2ndCol = 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;
export type NumberIn3rdCol = 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45;
export type NumberIn4thCol = 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60;
export type NumberIn5thCol = 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75;

export type BingoNumber = NumberIn1stCol | NumberIn2ndCol | NumberIn3rdCol | NumberIn4thCol | NumberIn5thCol;

export type BingoTicket = [
    [NumberIn1stCol, NumberIn2ndCol, NumberIn3rdCol, NumberIn4thCol, NumberIn5thCol],
    [NumberIn1stCol, NumberIn2ndCol, NumberIn3rdCol, NumberIn4thCol, NumberIn5thCol],
    [NumberIn1stCol, NumberIn2ndCol, /* wild card */ NumberIn4thCol, NumberIn5thCol],
    [NumberIn1stCol, NumberIn2ndCol, NumberIn3rdCol, NumberIn4thCol, NumberIn5thCol],
    [NumberIn1stCol, NumberIn2ndCol, NumberIn3rdCol, NumberIn4thCol, NumberIn5thCol],
]

export type BingoAction =
    | { type: "registered", payload: { name: string, ticket: BingoTicket } }
    | { type: "numberDrawn", payload: BingoNumber }

export interface BingoState {
    readonly players: Readonly<Array<{ name: string, ticket: BingoTicket }>>;
    readonly numbersDrawn: readonly number[];
    readonly winners: readonly string[];
    availableNumbersToDraw?: number[]
}
