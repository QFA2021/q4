<template>
  <table :class="{ mayCollapse: state.playerAllowedCollapses >= 1 }">
    <tr class="controls" :class="{ player1: state.next_player }">
      <th v-for="column in state.width" :key="column">
        <button @click="placeColor(column)" class="color">Color</button>
        <template v-if="!colorPiece">
          <button @click="placeClassical(column)" class="classic">
            Classic
          </button>
          <button
            @click="prepare(column)"
            v-if="preparedColumn === undefined"
            class="space"
          >
            Space 1st
          </button>
          <button
            @click="placeSpace(column)"
            v-else-if="preparedColumn != column"
            class="space"
          >
            Space 2nd
          </button>
          <button @click="preparedColumn = undefined" v-else class="reset">
            Reset
          </button>
        </template>
      </th>
    </tr>
    <tr v-for="row in state.height" :key="row">
      <td
        v-for="column in state.width"
        :key="column"
        :set="(col = state.occupancyCache[column]?.[row])"
        :class="{ empty: col === undefined }"
      >
        <template v-for="piece in col" :key="piece.id">
          <transition name="slide" appear>
            <div
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
                  !piece.stable &&
                  highlightOccupancy[column]?.[row]?.has(piece),
                highlightColor:
                  // part of highlighted color superposition piece
                  piece.colorPieceOther !== undefined &&
                  piece.colorID === highlight?.piece?.colorID,
                winning: state.winner?.pieces?.has(piece),
              }"
              @click="collapse(column, row, piece)"
              @mouseover="
                highlight = { column: column, row: row, piece: piece }
              "
              @mouseleave="highlight = undefined"
              :title="getPieceActionHint(piece) + getActionPieceDebug(piece)"
            >
              {{ piece.id }}
            </div>
          </transition>
        </template>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
  isSuperposColorPiece,
  isFullySetSuperposColorPiece,
} from "@/GameLogic";
import { GameState, Piece } from "@/GameState";
import { computeWorldOccupationFilter, playerToColor } from "@/GameVisual";

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

  getPieceActionHint(p: Piece): string {
    if (isSuperposColorPiece(p)) {
      if (isFullySetSuperposColorPiece(p)) {
        return this.state.playerAllowedCollapses >= 1
          ? "Click this to collapse it to " +
              playerToColor(this.state.next_player)
          : "You have no collapses left before your move.";
      } else {
        return "You need to choose a position for the other piece first";
      }
    } else if (!p.stable) {
      return this.state.playerAllowedCollapses >= 1
        ? "Click to collapse here"
        : "You have no collapses left before your move.";
    }

    return "";
  }

  getActionPieceDebug(piece: Piece): string {
    return process.env.NODE_ENV === "production"
      ? ""
      : `
ID: ${piece.id}
player: ${piece.player1} ${playerToColor(piece.player1)}
stable: ${piece.stable}
colorID: ${piece.colorID}
colorORef: ${piece.colorPieceOther}
allowedCollapses: ${this.state.playerAllowedCollapses}`;
  }

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
    // reject
    if (this.state.playerAllowedCollapses < 1) {
      return;
    }

    // only keep worlds where piece is in (column, row)
    // ignore events, where the piece is already stable
    if (!piece.stable || piece.colorPieceOther !== undefined) {
      this.$emit("manualCollapse", column, row, piece);
      this.highlight = undefined;
    }
  }

  get highlightOccupancy() {
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
  height: 77px;
  vertical-align: baseline;
}
th button {
  width: 80%;
  margin: 2px auto 0;
  border: none;
  border-radius: 7px;
  height: 22px;
  cursor: pointer;

  color: white;
  font-weight: bold;
  transition: transform 0.1s, ease, background-color 0.3s ease;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 20%);
}
th button:hover {
  transform: translateY(-1px);
  box-shadow: 0px 3px 2px rgb(0 0 0 / 20%);
}

th button.color {
  background: linear-gradient(90deg, red, blue);
}
.controls.player1 th button.color {
  background: linear-gradient(90deg, blue, red);
}
th button.classic {
  background: blue;
}
.controls.player1 th button.classic {
  background: red;
}
th button.space {
  background: linear-gradient(90deg, blue, rgba(0, 0, 0, 0.7), blue);
}
.controls.player1 th button.space {
  background: linear-gradient(90deg, red, rgba(0, 0, 0, 0.7), red);
}
th button.reset {
  background: black;
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

  transition: background-color 0.1s ease, color 0.1s ease;
  font-size: 51px;
  font-weight: bold;
}
td div.small {
  border-width: 8px;
  width: 45px;
  height: 45px;
  margin: 2px;
  font-size: 25px;
}
td div.player1 {
  border-color: red;
}
.mayCollapse td div.small,
.mayCollapse td div.highlightColor {
  cursor: pointer;
}

td div.winning {
  box-shadow: 0px 0px 10px 5px rgb(255 255 0);
}

td div.highlight {
  background-color: yellow;
}
td div.highlight.color {
  color: yellow;
}
td div.highlightColor {
  background-color: greenyellow;
}

td div.color {
  position: relative;
  border-color: transparent;
  background: none;
  color: white;
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

td div.slide-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out,
    background-color 0.3s ease;
}
td div.slide-enter-from {
  transform: translateY(-50px);
  opacity: 0;
}
</style>
