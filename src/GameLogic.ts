import { insertPiece } from "./ClassicGame";
import { GameState, Piece, World } from "./GameState";

function nextPiece(state: GameState): Piece {
    return {
        id: state.next_stone_id,
        player1: state.next_player,
        stable: true
    }
}

export function printgs(state: GameState) {
    for (const world of state.worlds) {
        for (const column in world.data) {
            for (const row in world.data[column]) {
                console.log(row)
            }
        }
        break; // only show 1 world
    }
}

// return true iff insertion is okay
export function insertClassicPiece(state: GameState, column: number): boolean {
    const piece = nextPiece(state)

    // insert piece mutates the world iff it returns true
    // thus any mutation implies newWorlds.length > 0
    // ~> no need to copy the world
    const newWorlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))
    if (newWorlds.length === 0) {
        return false;
    }

    // step game forward and accept move
    state.worlds = newWorlds;
    state.next_stone_id++;
    state.next_player = !state.next_player;
    return true;
}

export function insertColorPiece(state: GameState, column: number): Piece {
    const piece = nextPiece(state)
    piece.colorID = state.next_color_id++

    // TODO: handle the case where no worlds remain
    state.worlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))
    state.next_stone_id++
    state.next_player = !state.next_player

    return piece
}

export function insertSecondColorPiece(state: GameState, column: number, piecePrimary: Piece) {
    // TODO: use the same id?
    const piece: Piece = {
        id: piecePrimary.id,
        player1: piecePrimary.player1,
        stable: piecePrimary.stable,
        colorID: piecePrimary.colorID,
        colorPieceOther: piecePrimary
    }
    piecePrimary.colorPieceOther = piece

    // TODO: handle the case where no worlds remain
    state.worlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))
    state.next_stone_id++
    state.next_player = !state.next_player
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

    // TODO: is it the other players turn now?
}