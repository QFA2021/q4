<template>
  <h1>
    <img
      src="@/assets/Title.svg"
      height="50"
      width="144"
      alt="q4 Logo"
      @click="$emit('toMenu')"
    />
    <span :class="{ player1: state.next_player }"
      >Next player: {{ getCurrentPlayerColor(state.next_player) }}</span
    >
  </h1>
  <GameBoard
    :state="state"
    :colorPiece="colorPiece !== undefined"
    @placeClassical="placeClassical"
    @placeSpace="placeSpace"
    @placeColor="placeColor"
    @manualCollapse="manualCollapse"
  />
  <Alert
    title="Illegal move!"
    message="That move is illegal! It cannot be completed in any of the possible world states."
    ref="modal"
  />
  <Alert
    title="Game Over!"
    :message="
      'Player ' +
      getCurrentPlayerColor(state.winner?.player1) +
      ' has won in all possible states of the game!'
    "
    v-if="state.winner !== undefined"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameBoard from "@/components/GameBoard.vue";
import Alert from "@/components/Alert.vue";
import { GameState, Piece } from "@/GameState";
import { playerToColor } from "@/GameVisual";
import {
  collapsePiece,
  insertClassicPiece,
  insertColorPiece,
  insertSecondColorPiece,
  insertSpacePiece,
} from "@/GameLogic";

@Options({
  props: {
    state: Object,
  },
  data() {
    return {
      colorPiece: undefined,
      gameWonShowed: false,
    };
  },
  emits: ["toMenu"],
  components: {
    GameBoard,
    Alert,
  },
})
export default class Game extends Vue {
  state!: GameState;
  colorPiece?: Piece = undefined;
  private gameWonShowed!: boolean;

  placeClassical(column: number) {
    if (!insertClassicPiece(this.state, column)) {
      (this.$refs.modal as Alert).showModal = true;
    }
  }
  placeColor(column: number) {
    if (this.colorPiece === undefined) {
      // first color piece
      this.colorPiece = insertColorPiece(this.state, column);
      if (this.colorPiece === undefined) {
        // illegal move
        (this.$refs.modal as Alert).showModal = true;
      }
    } else {
      // second color piece
      if (insertSecondColorPiece(this.state, column, this.colorPiece)) {
        this.colorPiece = undefined;
      } else {
        (this.$refs.modal as Alert).showModal = true;
      }
    }
  }
  placeSpace(...columns: number[]) {
    if (!insertSpacePiece(this.state, columns)) {
      (this.$refs.modal as Alert).showModal = true;
    }
  }

  manualCollapse(column: number, row: number, piece: Piece) {
    collapsePiece(this.state, column, row, piece);
  }

  getCurrentPlayerColor(player: boolean) {
    return playerToColor(player);
  }
}
</script>

<style scoped>
h1 {
  position: sticky;
  top: 0;
  z-index: 10;

  height: 50px;
  margin: 10px 0;

  background: white;
  border-bottom: 1px solid black;
}

h1 span {
  top: -15px;
  position: relative;
  margin-left: 20px;
  color: blue;
}
h1 span.player1 {
  color: red;
}

h1 img {
  cursor: pointer;
}
</style>
