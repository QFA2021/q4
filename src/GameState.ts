export interface GameState {
    width: number,
    height: number,
    next_player: boolean,
    next_stone_id: number,
    next_color_id: number,
    worlds: World[],
}

export interface World {
    [index: number]: WorldRow
}

export interface WorldRow {
    [index: number]: Piece
}

export interface Piece {
    id: number,
    player1: boolean,
    colorID?: number
}

export const exampleState: GameState = {
    width: 6,
    height: 6,
    next_player: true,
    next_stone_id: 1,
    next_color_id: 1,

    worlds: [
        {
            2: {
                5: {
                    id: 2,
                    player1: true,
                },
            },
            3: {
                5: {
                    id: 1,
                    player1: false,
                },
            },
        },
        {
            2: {
                5: {
                    id: 2,
                    player1: true,
                },
            },
            4: {
                5: {
                    id: 1,
                    player1: false,
                },
            },
        },
        {
            3: {
                4: {
                    id: 2,
                    player1: true,
                },
                5: {
                    id: 1,
                    player1: false,
                },
            },
        },
        {
            3: {
                5: {
                    id: 2,
                    player1: true,
                },
            },
            4: {
                5: {
                    id: 1,
                    player1: false,
                },
            },
        },
    ],
}