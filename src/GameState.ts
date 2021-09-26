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