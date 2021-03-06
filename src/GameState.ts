export interface GameRules {
    // board dimensions
    width: number,
    height: number,

    // game rules
    collapsingIsMove: boolean,
    collapsesBeforeMove: number,
    classicalMovesStart: number,
    classicalMovesMaximum: number,
}


export interface GameState extends GameRules {
    // internal/invisible state
    next_player: boolean, // true iff its the red player's turn. TODO rename to nextPlayerRed
    next_stone_id: number, // ID of next move to be done by a player
    next_color_id: number,
    playerAllowedCollapses: number,
    playerDoubleAllowedClassical: number[],

    // board state
    worlds: World<Winner,Piece>[],
    winner?: Winner,

    // reference to the first color piece if the 2nd has yet to be placed
    colorPiece?: Piece,

    // cache for board occupancy
    // for each cell we store the set of pieces that occur there in *any* world
    occupancyCache: WorldStack<WorldStack<Set<Piece>>>,
}

export interface World<W,T> {
    data: WorldStack<WorldStack<T>>,

    // undefined ~> no winner yet
    winner?: W,
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
    colorPieceSecond?: boolean, // true if this is the first of the two color pieces
    colorPieceOther?: Piece, // reference to the other piece
}

export interface Winner {
    player1: boolean, // true iff player1 has won
    pieces: Set<Piece>,
}


export function emptyGame(rules: GameRules): GameState {
    return {
        ...rules,

        next_player: Math.random() < .5,
        next_stone_id: 1,
        next_color_id: 1,
        playerAllowedCollapses: rules.collapsesBeforeMove,
        playerDoubleAllowedClassical: [2 * rules.classicalMovesStart, 2 * rules.classicalMovesStart],

        worlds: [{
            data: {}
        }],
        occupancyCache: {},
    }
}