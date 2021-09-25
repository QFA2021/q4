import { insertPiece } from "./ClassicGame";
import { GameState, Piece, World } from "./GameState";

function nextPiece(state: GameState): Piece {
    return {
        id: state.next_stone_id,
        player1: state.next_player,
        stable: true
    }
}

export function insertClassicPiece(state: GameState, column: number) {
    const piece = nextPiece(state)

    // TODO: handle the case where no worlds remain
    state.worlds = state.worlds.filter(world => insertPiece(state.height, world, column, piece))
    state.next_stone_id++
    state.next_player = !state.next_player
}

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