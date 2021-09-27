import { World, Piece } from "./GameState";

/**
 * Inserts $piece into $world at column $column
 * Computes the new world winner, if not already won
 *
 * Returns true iff the world was mutated
 * ~> returns false iff the move is illegal
 */
export function insertPiece(height: number, width: number,
    world: World<Piece>, column: number, piece: Piece): boolean {
    if (column in world.data) {
        let row = height
        while (row >= 1) {
            if (row in world.data[column]) {
                row--
            } else {
                world.data[column][row] = piece
                if (world.winner === undefined) {
                    world.winner = computeWinner(height, width, world)
                }

                return true
            }
        }

        // column is full
        return false
    }

    // column is empty so far
    world.data[column] = {}
    world.data[column][height] = piece
    if (world.winner === undefined) {
        world.winner = computeWinner(height, width, world)
    }

    return true
}

const WIN_LENGTH = 4;
export function computeWinner(height: number, width: number, world: World<Piece>) {
    // columns
    for (let column = 1; column <= width; column++) {
        const winner = checkWinnerDirection(height, width, world,
            1, column, 1, 0);
        if (winner !== undefined) {
            return winner;
        }

        // diagonals: sufficient to check diagonals going right
        for (let row = 1; row <= height - WIN_LENGTH; row++) {
            // check diagonal going to top right
            const winnerTop = checkWinnerDirection(height, width, world,
                row, column, 1, -1);
            if (winnerTop !== undefined) {
                return winnerTop;
            }

            // check diagonal going to bottom right
            const winnerBottom = checkWinnerDirection(height, width, world,
                row, column, 1, 1);
            if (winnerBottom !== undefined) {
                return winnerBottom;
            }
        }
    }

    // rows
    for (let row = 1; row <= height; row++) {
        const winner = checkWinnerDirection(height, width, world,
            row, 1, 0, 1);
        if (winner !== undefined) {
            return winner;
        }
    }
}

/**
 * Checks for a winner in direction (rowD, columnD) starting from (row, column)
 * Return player1 as bool or undefined
 */
function checkWinnerDirection(height: number, width: number,
    world: World<Piece>, row: number, column: number,
    rowD: number, columnD: number): boolean | undefined {
    let count = 0
    let player1 = undefined

    while (row <= height && column <= width) {
        if (world.data[column]?.[row]?.colorID !== undefined) {
            // ignore color pieces
            count = 0
            player1 = undefined
        } else {
            const nextPlayer1 = world.data[column]?.[row]?.player1
            if (nextPlayer1 !== player1) {
                count = 1
                player1 = nextPlayer1
            } else if (++count >= WIN_LENGTH) {
                return player1
            }
        }

        // step into direction (rowD, columnD)
        row += rowD
        column += columnD
    }

    return undefined
}
