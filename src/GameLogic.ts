import { insertPiece } from "./ClassicGame";
import { GameState, Piece } from "./GameState";

export function insertClassicPiece(state: GameState, column: number) {
    const piece: Piece = {
        id: state.next_stone_id,
        player1: state.next_player
    }

    // TODO: handle the case where no worlds remain
    state.worlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))
    state.next_stone_id++
    state.next_player = !state.next_player
}
