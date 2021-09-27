export interface GameState {
    // board dimensions
    width: number,
    height: number,

    // internal/invisible state
    next_player: boolean, // true iff its the red player's turn
    next_stone_id: number, // ID of next move to be done by a player
    next_color_id: number,

    // board state
    worlds: World<Piece>[],

    // cache for board occupancy
    // for each cell we store the set of pieces that occur there in *any* world
    occupancyCache: WorldStack<WorldStack<Set<Piece>>>,
}

export interface World<T> {
    data: WorldStack<WorldStack<T>>,

    // undefined ~> no winner yet
    winner?: Boolean,
}

export interface WorldStack<T> {
    [index: number]: T
}

export interface Piece {
    id: number, // id of the move this piece was inserted
    player1: boolean, // true iff inserted by red player

    // used by ui to mark pieces that are stable/already in the final position
    stable: boolean,

    // optional for pieces in color-supoerposition
    colorID?: number,
    colorPieceOther?: Piece, // reference to the other piece
}

export function emptyGame(width: number, height: number): GameState {
    return {
        width: width,
        height: height,
        next_player: Math.random() < .5,
        next_stone_id: 1,
        next_color_id: 1,

        worlds: [{
            data: {}
        }],
        occupancyCache: {}
    }
}