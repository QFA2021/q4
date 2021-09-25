export interface GameState {
    width: number,
    height: number,
    next_player: boolean,
    next_stone_id: number,
    next_color_id: number,
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
    player1: boolean,
    colorID?: number
}


const p1: Piece = {
    id: 1,
    player1: true
}
const p2: Piece = {
    id: 2,
    player1: false
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