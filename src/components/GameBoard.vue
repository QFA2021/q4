<template>
  <p>
    total worlds: {{ state.worlds.length }}, red won: {{ winning.red }}, blue
    won: {{ winning.blue
    }}<template v-if="winning.red + winning.blue >= state.worlds.length"
      >, <span style="font-weight: bold">All games won!</span>
    </template>
  </p>
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
            player1:
              // no color superposition ~> use piece player
              (piece.player1 && piece.colorPieceOther === undefined) ||
              // color superposition and one of the options is hovered
              (piece.colorPieceOther !== undefined &&
                piece.colorID === highlight?.piece?.colorID &&
                // then highlight hovered piece in next player color
                !((piece === highlight.piece) ^ state.next_player)),
            color:
              piece.colorID !== undefined &&
              // no highlighting when 2nd piece missing (i.e. when colorPieceOther = undefined)
              (piece.colorPieceOther === undefined ||
                piece.colorID !== highlight?.piece?.colorID),
            highlight:
              // non-color non-stable is highlighted ~> highlight pieces in resulting remaining worlds
              highlightOccupation[column]?.[row]?.has(piece),
            highlightColor:
              // part of highlighted color superposition piece
              piece.colorPieceOther !== undefined &&
              piece.colorID === highlight?.piece?.colorID,
          }"
          @click="collapse(column, row, piece)"
          @mouseover="highlight = { column: column, row: row, piece: piece }"
          @mouseleave="highlight = undefined"
          :title="
            'ID:' +
            piece.id +
            '\nPlayer: ' +
            piece.player1 +
            '\nstable: ' +
            piece.stable +
            '\ncolorID: ' +
            piece.colorID +
            '\ncolorORef: ' +
            piece.colorPieceOther
          "
        >
          {{ piece.id }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { GameState, Piece } from "@/GameState";
import {
  computeWorldOccupation,
  computeWorldOccupationFilter,
} from "@/GameVisual";

interface Highlight {
  column: number;
  row: number;
  piece: Piece;
}

@Options({
  props: {
    state: Object,
    colorPiece: Boolean,
  },
  data() {
    return {
      preparedColumn: undefined,
      highlight: undefined,
    };
  },
  emits: ["placeClassical", "placeSpace", "placeColor", "manualCollapse"],
})
export default class GameBoard extends Vue {
  state!: GameState;
  colorPiece!: Boolean;
  preparedColumn?: number;
  highlight?: Highlight;

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
    if (!piece.stable || piece.colorPieceOther !== undefined) {
      this.$emit("manualCollapse", column, row, piece);
      this.highlight = undefined;
    }
  }

  get winning() {
    const counts = { red: 0, blue: 0, total: this.state.worlds.length };
    this.state.worlds
      .filter((world) => world.winner !== undefined)
      .forEach((world) => counts[world.winner ? "red" : "blue"]++);

    return counts;
  }

  get occupation() {
    return computeWorldOccupation(this.state);
  }

  get highlightOccupation() {
    // no highlight occupation for color superposition or stable pieces
    return this.highlight === undefined ||
      this.highlight.piece.stable ||
      this.highlight.piece.colorID !== undefined
      ? {}
      : computeWorldOccupationFilter(
          this.state,
          this.highlight.column,
          this.highlight.row,
          this.highlight.piece
        );
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

td div.highlight {
  background-color: yellow !important;
}
td div.highlightColor {
  background-color: greenyellow;
  cursor: pointer;
}

td div.color {
  position: relative;
  border-color: transparent;
  background: white;
  background-clip: padding-box;
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
