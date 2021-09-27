import { GameState, Piece, WorldStack } from "./GameState";

export function playerToColor(player_red: boolean): string {
    return player_red ? "Red" : "Blue"
}

/**
 * Groups the pieces by the position they occur in some world.
 * Computes / updates all piece stability
 */
export function computeWorldOccupation(state: GameState): WorldStack<WorldStack<Set<Piece>>> {
    // for each cell collect the pieces that occur there
    const res: WorldStack<WorldStack<Set<Piece>>> = {};

    // detect if a piece occures at multiple positions accross worlds
    const piecePos = new Map<Piece, { row: string; column: string }>();

    for (const world of state.worlds) {
        for (const column in world.data) {
            if (!(column in res)) {
                res[column] = {};
            }

            for (const row in world.data[column]) {
                if (!(row in res[column])) {
                    res[column][row] = new Set();
                }

                // piece has occured at (column, row)
                const piece = world.data[column][row];
                res[column][row].add(piece);

                // check if piece occured at a different position
                // TODO: this (view update) code mutates the (global) state
                const pos = piecePos.get(piece);
                if (pos === undefined) {
                    // piece has not been seen yet
                    piecePos.set(piece, { row: row, column: column });
                    piece.stable = true;
                } else if (pos.row != row || pos.column != column) {
                    // piece detected at different position
                    piece.stable = false;
                }
            }
        }
    }

    return res
}

/**
 * Groups the pieces by the position they occur in some world.
 * Only considers worlds where targetPiece occurs in (targetColumn, targetRow)
 */
export function computeWorldOccupationFilter(state: GameState, targetColumn: number, targetRow: number, targetPiece: Piece): WorldStack<WorldStack<Set<Piece>>> {
    // for each cell collect the pieces that occur there
    const res: WorldStack<WorldStack<Set<Piece>>> = {};
    for (const world of state.worlds) {
        // validate the world
        if (world.data[targetColumn]?.[targetRow] !== targetPiece) {
            continue
        }

        // proceede as in above function
        for (const column in world.data) {
            if (!(column in res)) {
                res[column] = {};
            }

            for (const row in world.data[column]) {
                if (!(row in res[column])) {
                    res[column][row] = new Set();
                }

                // piece has occured at (column, row)
                const piece = world.data[column][row];
                res[column][row].add(piece);
            }
        }
    }

    return res
}