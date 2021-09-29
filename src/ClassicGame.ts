import { World, Piece, Winner } from "./GameState";

/**
 * Inserts $piece into $world at column $column
 * Computes the new world winner, if not already won
 *
 * Returns true iff the world was mutated
 * ~> returns false iff the move is illegal
 */
export function insertPiece(height: number, world: World<Piece>, column: number, piece: Piece): boolean {
    if (column in world.data) {
        let row = height
        while (row >= 1) {
            if (row in world.data[column]) {
                row--
            } else {
                world.data[column][row] = piece
                return true
            }
        }

        // column is full
        return false
    }

    // column is empty so far
    world.data[column] = {}
    world.data[column][height] = piece
    return true
}

const WIN_LENGTH = 4;
export function computeWinner(height: number, width: number, world: World<Piece>, onlyStable: boolean = true) {
    // columns
    for (let column = 1; column <= width; column++) {
        const winner = checkWinnerDirection(height, width, world,
            1, column, 1, 0, onlyStable);
        if (winner !== undefined) {
            return winner;
        }

        // diagonals: sufficient to check diagonals going right
        for (let row = 1; row <= height - WIN_LENGTH; row++) {
            // check diagonal going to top right
            const winnerTop = checkWinnerDirection(height, width, world,
                row, column, 1, -1, onlyStable);
            if (winnerTop !== undefined) {
                return winnerTop;
            }

            // check diagonal going to bottom right
            const winnerBottom = checkWinnerDirection(height, width, world,
                row, column, 1, 1, onlyStable);
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
    rowD: number, columnD: number, onlyStable: boolean = true): Winner | undefined {
    let count = 0
    let player1 = undefined

    while (row <= height && column <= width) {
        const piece = world.data[column]?.[row]
        if (piece === undefined || piece.colorID !== undefined || (onlyStable && !piece.stable)) {
            // always ignore color pieces
            // only use stable cells if specified
            count = 0
            player1 = undefined
        } else {
            const nextPlayer1 = piece?.player1
            if (nextPlayer1 !== player1) {
                count = 1
                player1 = nextPlayer1
            } else if (++count >= WIN_LENGTH) {
                // game is won
                const winner: Winner = {
                    player1: player1,
                    pieces: new Set()
                }

                // collect the winning pieces
                winner.pieces.add(piece)
                for (let i = 1; i < WIN_LENGTH; i++) {
                    row -= rowD
                    column -= columnD
                    winner.pieces.add(world.data[column]?.[row])
                }

                return winner
            }
        }

        // step into direction (rowD, columnD)
        row += rowD
        column += columnD
    }

    return undefined
}
