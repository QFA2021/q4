import { computeWinner, insertPiece } from "./ClassicGame";
import { GameState, Piece, World } from "./GameState";
import { computeWorldOccupation } from "./GameVisual";

function nextPiece(state: GameState): Piece {
    return {
        id: state.next_stone_id,
        player1: state.next_player,
        stable: true
    }
}

export function isSuperposColorPiece(p: Piece): boolean {
    return p.colorID !== undefined
}

// Color pieces are two pieces inserted at different positions
// Returns true iff both pieces are already inserted on the board
export function isFullySetSuperposColorPiece(p: Piece): boolean {
    return p.colorID !== undefined && p.colorPieceOther !== undefined
}


// return true iff insertion is okay
export function insertClassicPiece(state: GameState, column: number): boolean {
    // you loose one classical piece
    // but stepGame always increases it by one
    const playerIndex = state.next_player ? 0 : 1
    state.playerDoubleAllowedClassical[playerIndex] -= 3

    if (internalPieceInsert(state, column, nextPiece(state))) {
        return true
    }

    // revert
    state.playerDoubleAllowedClassical[playerIndex] += 3
    return false
}

function internalPieceInsert(state: GameState, column: number, piece: Piece) {
    // insert piece mutates the world iff it returns true
    // thus any mutation implies newWorlds.length > 0
    // ~> no need to copy the world
    const newWorlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece));

    // reject if no world remains
    if (newWorlds.length === 0) {
        return false
    }

    // step game forward and accept move
    state.worlds = newWorlds;
    state.next_stone_id++;
    state.next_player = !state.next_player;
    stepGame(state)
    return true;
}

/**
 * Steps the game forward
 * This needs to be called after every change to the worlds!
 */
function stepGame(state: GameState, collapsed: boolean = false) {
    // update occupancy and piece stability
    state.occupancyCache = computeWorldOccupation(state)

    // winner calculation
    if (state.winner === undefined) {
        // compute winner in all worlds and collect winning pieces
        const winPlayers = new Set<boolean>();
        const winPieces = new Set<Piece>()
        for (const world of state.worlds) {
            if (world.winner === undefined) {
                world.winner = computeWinner(state.height, state.width, world)
            }

            if (world.winner !== undefined) {
                winPlayers.add(world.winner.player1);
                world.winner.pieces.forEach(piece => winPieces.add(piece));
            }
        }

        // worlds won by a single player
        if (winPlayers.size === 1) {
            state.winner = {
                player1: winPlayers.values().next().value,
                pieces: winPieces
            }
        }
    }

    // apply game rules
    if (collapsed) {
        state.playerAllowedCollapses--
        if (state.collapsingIsMove) {
            state.next_player = !state.next_player
        }
    } else { // performed a move
        const playerIndex = state.next_player ? 1 : 0
        state.playerDoubleAllowedClassical[playerIndex] =
            Math.min(state.playerDoubleAllowedClassical[playerIndex] + 1, 2 * state.classicalMovesMaximum)
        state.playerAllowedCollapses = state.collapsesBeforeMove

        // you get another turn if the other player has no classical moves left
        if (state.playerDoubleAllowedClassical[1 - playerIndex] <= 1) {
            state.playerDoubleAllowedClassical[1 - playerIndex] += 2 * state.classicalMovesStart
            state.next_player = !state.next_player
        }
    }
}


export function insertColorPiece(state: GameState, column: number): Piece | undefined {
    const piece = nextPiece(state)
    piece.colorID = state.next_color_id
    if (internalPieceInsert(state, column, piece)) {
        state.next_color_id++
        return piece
    }

    return undefined
}

export function insertSecondColorPiece(state: GameState, column: number, piecePrimary: Piece): boolean {
    // TODO: use the same id?
    const piece: Piece = {
        id: piecePrimary.id,
        player1: piecePrimary.player1,
        stable: piecePrimary.stable,
        colorID: piecePrimary.colorID,
        colorPieceOther: piecePrimary
    }

    if (internalPieceInsert(state, column, piece)) {
        piecePrimary.colorPieceOther = piece
        return true
    }

    return false
}

// insert piece: superposition in location
export function insertSpacePiece(state: GameState, columns: number[]): boolean {
    const piece = nextPiece(state)

    // try to insert new space-piece
    const newWorlds = [] as World<Piece>[]
    for (const world of state.worlds) {
        // iterate over the insertion columns
        for (const column of columns) {
            const worldClone = cloneWorld(world);
            if (insertPiece(state.height, worldClone, column, piece)) {
                newWorlds.push(worldClone)
            }
        }
    }

    // reject if no world remains
    if (newWorlds.length === 0) {
        return false
    }

    // step game forward and accept move
    state.worlds = newWorlds
    state.next_stone_id++
    state.next_player = !state.next_player
    stepGame(state)
    return true
}

function cloneWorld<T>(world: World<T>): World<T> {
    const newWorld = {
        data: {},
        winner: world.winner
    } as World<T>;
    for (const column in world.data) {
        newWorld.data[column] = {};
        for (const row in world.data[column]) {
            newWorld.data[column][row] = world.data[column][row];
        }
    }

    return newWorld
}


/**
 * Only keep worlds where piece is in (column, row)
 */
export function collapsePiece(state: GameState, column: number, row: number, piece: Piece) {
    if (piece.colorPieceOther === undefined) {
        state.worlds = state.worlds.filter(world => {
            return world.data[column]?.[row] === piece
        });
    } else {
        // piece is in color superposition
        const pieceOther = piece.colorPieceOther;

        // mark the clicked piece as belonging to the player
        piece.colorID = undefined;
        piece.colorPieceOther = undefined;
        piece.player1 = state.next_player;

        // mark the other piece as belonging to the opponent
        pieceOther.colorID = undefined;
        pieceOther.colorPieceOther = undefined;
        pieceOther.id++;
        pieceOther.player1 = !state.next_player;
    }

    // update occupancy cache and piece stability
    stepGame(state, true)
}
