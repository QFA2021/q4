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
        for (const column in world) {
            for (const row in world[column]) {
                console.log(row)
            }
        }
        break; // only show 1 world
    }
}

// return true iff insertion is okay
export function insertClassicPiece(state: GameState, column: number): boolean {
    const piece = nextPiece(state)

    const newWorlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))

    if (newWorlds.length == 0) {
        // no worlds remain
        console.log("Illegal move!");
        return false;
    } else {
        state.worlds = newWorlds;
        state.next_stone_id++;
        state.next_player = !state.next_player;
        return true;
    }
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
    // TODO use deep copy function of stdlib?
    const piece: Piece = {
        id: piecePrimary.id,
        player1: piecePrimary.player1,
        stable: piecePrimary.stable,
        colorID: piecePrimary.colorID
    }

    // TODO: handle the case where no worlds remain
    state.worlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))
    state.next_stone_id++
    state.next_player = !state.next_player
}

// insert piece: superposition in location
export function insertSpacePiece(state: GameState, columns: number[]) {
    const piece = nextPiece(state)

    // TODO: handle the case where no worlds remain
    const newWorlds = [] as World<Piece>[]
    for (const world of state.worlds) {
        for (const column of columns) {
            // TODO: yes, this could be improved
            const worldClone = cloneWorld(world);
            if (insertPiece(state.height, worldClone, column, piece)) {
                newWorlds.push(worldClone)
            }
        }
    }

    // store new state
    state.worlds = newWorlds
    state.next_stone_id++
    state.next_player = !state.next_player
}

function cloneWorld<T>(world: World<T>): World<T> {
    const newWorld = {} as World<T>;
    for (const column in world) {
        newWorld[column] = {};
        for (const row in world[column]) {
            newWorld[column][row] = world[column][row];
        }
    }

    return newWorld
}