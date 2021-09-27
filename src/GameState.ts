export interface GameState {
    // board dimensions
    width: number,
    height: number,
    // internal/invisible state
    next_player: boolean, // true iff its the red player's turn
    next_stone_id: number,
    next_color_id: number,
    // board state
    worlds: World<Piece>[],
}

export interface World<T> {
    [index: number]: WorldRow<T>
}

export interface WorldRow<T> {
    [index: number]: T
}

export interface Piece {
    id: number,
    player1: boolean, // true iff inserted by first player
    colorID?: number, // optional, exists iff it's superposition in color
    stable: boolean
}


const p1: Piece = {
    id: 1,
    player1: true,
    stable: false
}
const p2: Piece = {
    id: 2,
    player1: false,
    stable: false
}
export const exampleState: GameState = {
    width: 6,
    height: 6,
    next_player: true,
    next_stone_id: 3,
    next_color_id: 1,

    worlds: [
        {
            2: {
                5: p2
            },
            3: {
                5: p1
            },
        },
        {
            2: {
                5: p2
            },
            4: {
                5: p1
            },
        },
        {
            3: {
                4: p2,
                5: p1
            },
        },
        {
            3: {
                5: p2,
            },
            4: {
                5: p1,
            },
        },
    ],
}

export function emptyGame(width: number, height: number): GameState {
    return {
        width: width,
        height: height,
        next_player: Math.random() < .5,
        next_stone_id: 1,
        next_color_id: 1,

        worlds: [{}]
    }
}