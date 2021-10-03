import { GameRules, GameState, Piece, Winner, World, WorldStack } from "./GameState";
import { computeWorldOccupation } from "./GameVisual";

// see GameState
export interface ExportGameState extends GameRules {
    // internal/invisible state
    next_player: boolean, // true iff its the red player's turn. TODO rename to nextPlayerRed
    next_stone_id: number, // ID of next move to be done by a player
    next_color_id: number,
    playerAllowedCollapses: number,
    playerDoubleAllowedClassical: number[],

    // board state
    worlds: World<ExportWinner, Piece>[],
    winner?: ExportWinner,

    // reference to the first color piece if the 2nd has yet to be placed
    colorPiece?: Piece,
}

// see Winner
interface ExportWinner {
    player1: boolean, // true iff player1 has won
    pieces: Piece[]
}

export function exportState(state: GameState): string {
    const data: ExportGameState = {
        ...state,
        worlds: state.worlds.map(exportWorld),
        winner: exportWinner(state.winner),

        // @ts-ignore
        occupancyCache: undefined,
    };

    return JSON.stringify(data)
}

function exportWorld(world: World<Winner, Piece>): World<ExportWinner, Piece> {
    const data: WorldStack<WorldStack<Piece>> = {};
    for (const column in world.data) {
        data[column] = {}

        for (const row in world.data[column]) {
            // remove circular references from pieces
            const piece = world.data[column][row]
            data[column][row] = { ...piece, colorPieceOther: undefined }
        }
    }

    return {
        winner: exportWinner(world.winner),
        data: data
    }
}

function exportWinner(winner?: Winner): ExportWinner | undefined {
    if (winner !== undefined) {
        return { player1: winner.player1, pieces: Array.from(winner.pieces) }
    }
}



export function importState(input: string): GameState | undefined {
    const state: ExportGameState = JSON.parse(input)

    // restore null to Infinity
    if (state.collapsesBeforeMove === null) {
        state.collapsesBeforeMove = Infinity
    }
    if (state.playerAllowedCollapses === null) {
        state.playerAllowedCollapses = Infinity
    }

    // pieces sharing the id should be unique (stored by reference)
    // separate all the second color pieces out
    const pieces = new Map<number, Piece>()
    const piecesSecond = new Map<number, Piece>()
    for (const world of state.worlds) {
        for (const column in world.data) {
            for (const row in world.data[column]) {
                // consider $piecesSecond iff piece is a 2nd color piece
                const piece = world.data[column][row]
                world.data[column][row] = pieceFromMap(
                    piece.colorPieceSecond ? piecesSecond : pieces, piece)
            }
        }

        // @ts-ignore
        const newWorld = world as World<Winner, Piece>
        newWorld.winner = importWinner(pieces, world.winner)
    }

    // add circular references to color pieces
    pieces.forEach(piece => {
        if (piece.colorID !== undefined) {
            const pieceSecond = piecesSecond.get(piece.id)
            if (pieceSecond !== undefined) {
                piece.colorPieceOther = pieceSecond
                pieceSecond.colorPieceOther = piece
            }
        }
    });

    // analogously restore colorPiece
    if (state.colorPiece !== undefined) {
        state.colorPiece = pieces.get(state.colorPiece.id)
    }


    // @ts-ignore
    const res: GameState = state

    // import winner and update occupancy cache
    res.winner = importWinner(pieces, state.winner);
    res.occupancyCache = computeWorldOccupation(res)

    return res
}

/**
 * Converts piece objects to singletons
 * Returns map[piece.id]
 * If unavailable, then map[piece.id] = piece
 */
function pieceFromMap(map: Map<number, Piece>, piece: Piece): Piece {
    const prev = map.get(piece.id)
    if (prev !== undefined) {
        return prev
    }

    // store the piece in the map
    map.set(piece.id, piece)
    return piece
}

function importWinner(pieces: Map<number, Piece>, winner?: ExportWinner): Winner | undefined {
    if (winner !== undefined) {
        return {
            player1: winner.player1,
            pieces: new Set(winner.pieces.map(piece => pieces.get(piece.id)!))
        }
    }
}
