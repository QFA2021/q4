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
