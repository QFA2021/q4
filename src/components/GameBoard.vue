<template>
  <table>
    <tr>
      <th v-for="column in state.width" :key="column">
        <button @click="$emit('place', column - 1)">Place</button>
      </th>
    </tr>
    <tr v-for="row in state.height" :key="row">
      <td
        v-for="column in state.width"
        :key="column"
        :style="occupationStyle(row, column)"
        :set="(col = occupation[column - 1]?.[row - 1])"
        :class="{ empty: col === undefined }"
      >
        <span
          v-for="cell in col"
          :key="cell.id"
          :class="{ small: true, player1: cell.player1 }"
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
  emits: ["place"],
})
export default class GameBoard extends Vue {
  state!: GameState;

  get occupation() {
    // res is ids at each (column,row)
    const res: World<Set<Piece>> = {};
    for (const world of this.state.worlds) {
      for (const column in world) {
        if (!(column in res)) {
          res[column] = {};
        }

        for (const row in world[column]) {
          if (!(row in res[column])) {
            res[column][row] = new Set();
          }

          res[column][row].add(world[column][row]);
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

td .small {
  border: 8px solid blue;
  border-radius: 100%;
  box-sizing: border-box;

  display: inline-block;
  width: 45px;
  height: 45px;
  margin: 2px;

  font-size: 25px;
  font-weight: bold;
}
td .small.player1 {
  border-color: red;
}
</style>
