<template>
  <table>
    <tr>
      <th v-for="column in state.width" :key="column">
        <button>Place</button>
      </th>
    </tr>
    <tr v-for="row in state.height" :key="row">
      <td
        v-for="column in state.width"
        :key="column"
        :style="occupationStyle(row, column)"
        :class="{ empty: occupation[column - 1]?.[row - 1] === undefined }"
      >
        <pre>{{ occupation[column - 1]?.[row - 1] }}</pre>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "GameBoard",
  props: {
    state: {
      type: Object,
      default() {
        return {
          width: 6,
          height: 6,
          next_player: true,
          next_stone_id: 1,
          next_color_id: 1,

          worlds: [
            {
              2: {
                5: {
                  id: 2,
                  player1: true,
                  colorID: null,
                },
              },
              3: {
                5: {
                  id: 1,
                  player1: false,
                  colorID: null,
                },
              },
            },
            {
              3: {
                4: {
                  id: 2,
                  player1: true,
                  colorID: null,
                },
                5: {
                  id: 1,
                  player1: false,
                  colorID: null,
                },
              },
            },
          ],
        };
      },
    },
  },

  computed: {
    occupation() {
      // res 
      const res = {};
      for (const world of this.state.worlds) {
        for (const column in world) {
          if (!(column in res)) {
            res[column] = {};
          }

          for (const row in world[column]) {
            if (!(row in res[column])) {
              res[column][row] = {};
            }

            const cell = world[column][row];
          }
        }
      }

      return res;
    },
  },

  methods: {
    occupationStyle(row, column) {
      const data = this.occupation[column]?.[row];

      return {
        // "background-color": Math.random() < 0.5 ? "red" : "blue",
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  border: 1px solid black;
  border-collapse: collapse;
  margin: 0 auto;
}
td,th {
  border: 1px solid black;
  width: 100px;
  height: 100px;
}

th {
  height: 50px;
}
</style>
