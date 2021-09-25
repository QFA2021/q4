import { World, WorldRow, Piece } from "./GameState";

/**
 * Inserts $piece into $world at column $column
 * Returns full if the move is illegal
 */
export function insertPiece(height: number, world: World<Piece>, column: number, piece: Piece): boolean {
    if (column in world) {
        let row = height
        while (row >= 0) {
            if (row in world[column]) {
                row--
            } else {
                world[column][row] = piece
                return true
            }
        }

        // column is full
        return false
    }

    // column is empty so far
    world[column] = {}
    world[column][height] = piece
    return true
}
