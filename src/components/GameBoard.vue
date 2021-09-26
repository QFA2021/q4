<template>
  <table>
    <tr class="controls">
      <th v-for="column in state.width" :key="column">
        <button @click="placeColor(column)">Color</button>
        <template v-if="!colorPiece">
          <button @click="placeClassical(column)">Classic</button>
          <button @click="prepare(column)" v-if="preparedColumn === undefined">
            Quantum
          </button>
          <button
            @click="placeSpace(column)"
            v-else-if="preparedColumn != column"
          >
            Space
          </button>
          <button @click="preparedColumn = undefined" v-else>Reset</button>
        </template>
      </th>
    </tr>
    <tr v-for="row in state.height" :key="row">
      <td
        v-for="column in state.width"
        :key="column"
        :set="(col = occupation[column]?.[row])"
        :class="{ empty: col === undefined }"
      >
        <div
          v-for="piece in col"
          :key="piece.id"
          :class="{
            small: !piece.stable,
            player1: piece.player1,
            color: piece.colorID !== undefined,
          }"
          @click="collapse(column, row, piece)"
          :title="'ID:'+piece.id + '\nPlayer: '+ piece.player1 + '\nstable: '+piece.stable + '\ncolorID: '+ piece.colorID + '\ncolorORef: '+ piece.colorPieceOther"
        >
          {{ piece.id }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { GameState, Piece, WorldStack } from "../GameState";

@Options({
  props: {
    state: Object,
    colorPiece: Boolean,
  },
  data() {
    return {
      preparedColumn: undefined,
    };
  },
  emits: ["placeClassical", "placeSpace", "placeColor", "manualCollapse"],
})
export default class GameBoard extends Vue {
  state!: GameState;
  colorPiece!: Boolean;
  preparedColumn?: number;

  prepare(column: number) {
    this.preparedColumn = column;
  }
  placeClassical(column: number) {
    this.$emit("placeClassical", column);
    this.preparedColumn = undefined;
  }
  placeColor(column: number) {
    this.$emit("placeColor", column);
    this.preparedColumn = undefined;
  }
  placeSpace(column: number) {
    this.$emit("placeSpace", this.preparedColumn, column);
    this.preparedColumn = undefined;
  }

  collapse(column: number, row: number, piece: Piece) {
    // only keep worlds where piece is in (column, row)
    // ignore events, where the piece is already stable
    if (!piece.stable || piece.colorID !== undefined) {
      this.$emit("manualCollapse", column, row, piece);
    }
  }

  get occupation() {
    // for each cell collect the pieces that occur there
    const res: WorldStack<WorldStack<Set<Piece>>> = {};

    // detect if a piece occures at multiple positions accross worlds
    const piecePos = new Map<Piece, { row: string; column: string }>();

    for (const world of this.state.worlds) {
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

    return res;
  }
}
</script>

<style scoped>
table {
  border: 1px solid black;
  border-collapse: collapse;
  margin: 0 auto;
}

td,
th {
  border: 1px solid black;
  width: 100px;
  height: 100px;
}

th {
  height: 50px;
}

td.empty {
  background-color: rgb(100, 100, 100, 0.2);
}

td div {
  border: 16px solid blue;
  border-radius: 100%;
  box-sizing: border-box;

  display: inline-block;
  width: 90px;
  height: 90px;

  font-size: 51px;
  font-weight: bold;
}
td div.small {
  border-width: 8px;
  width: 45px;
  height: 45px;
  margin: 2px;
  font-size: 25px;
  cursor: pointer;
}
td div.player1 {
  border-color: red;
}

td div.color {
  position: relative;
  border-color: transparent;
  background: white;
  background-clip: padding-box;
  cursor: pointer;
}
td div.color:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: linear-gradient(90deg, blue, red);
  border-radius: inherit;
  z-index: -1;
  margin: -16px;

  animation: spin 4s linear infinite;
}
td div.color.small:before {
  margin: -8px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
