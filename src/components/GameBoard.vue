<template>
  <table>
    <tr>
      <th v-for="column in state.width" :key="column">
        <button @click="placeClassical(column)">Classic</button>
        <button
          @click="prepare(column)"
          v-if="preparedColumn === undefined"
        >
          Quantum
        </button>
        <button @click="placeSpace(column)" v-else-if="preparedColumn != column">Space</button>
        <button @click="preparedColumn = undefined" v-else>Reset</button>
      </th>
    </tr>
    <tr v-for="row in state.height" :key="row">
      <td
        v-for="column in state.width"
        :key="column"
        :style="occupationStyle(row, column)"
        :set="(col = occupation[column]?.[row])"
        :class="{ empty: col === undefined }"
      >
        <span
          v-for="cell in col"
          :key="cell.id"
          :class="{ small: !cell.stable, player1: cell.player1 }"
        >
          {{ cell.id }}
        </span>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { GameState, World, Piece } from "../GameState";

@Options({
  props: {
    state: Object,
  },
  data() {
    return {
      preparedColumn: undefined,
    };
  },
  emits: ["placeClassical", "placeSpace", "placeColor"],
})
export default class GameBoard extends Vue {
  state!: GameState;
  preparedColumn?: number;

  prepare(column: number) {
    this.preparedColumn = column;
  }
  placeClassical(column: number){
    this.$emit("placeClassical", column);
    this.preparedColumn = undefined;
  }
  placeSpace(column: number) {
    this.$emit("placeSpace", this.preparedColumn, column);
    this.preparedColumn = undefined;
  }

  get occupation() {
    // for each cell collect the pieces that occur there
    const res: World<Set<Piece>> = {};

    // detect if a piece occures at multiple positions accross worlds
    const piecePos = new Map<Piece, { row: string; column: string }>();

    for (const world of this.state.worlds) {
      for (const column in world) {
        if (!(column in res)) {
          res[column] = {};
        }

        for (const row in world[column]) {
          if (!(row in res[column])) {
            res[column][row] = new Set();
          }

          // piece has occured at (column, row)
          const piece = world[column][row];
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

  occupationStyle(row: number, column: number) {
    const data = this.occupation[column]?.[row];

    return {
      // "background-color": Math.random() < 0.5 ? "red" : "blue",
    };
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

td span {
  border: 16px solid blue;
  border-radius: 100%;
  box-sizing: border-box;

  display: inline-block;
  width: 90px;
  height: 90px;

  font-size: 51px;
  font-weight: bold;
}
td span.small {
  border-width: 8px;
  width: 45px;
  height: 45px;
  margin: 2px;
  font-size: 25px;
}
td span.player1 {
  border-color: red;
}
</style>
