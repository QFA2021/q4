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
    <button @click="$refs.expl.open()">Help</button>
  </h1>
  <GameBoard
    :state="state"
    :colorPiece="colorPiece !== undefined"
    @placeClassical="placeClassical"
    @placeSpace="placeSpace"
    @placeColor="placeColor"
    @manualCollapse="manualCollapse"
  />
  <p
    v-if="state.collapsesBeforeMove < Infinity"
    :class="{ outOfMoves: state.playerAllowedCollapses === 0 }"
  >
    You have performed {{ state.playerAllowedCollapses }} out of
    {{ state.collapsesBeforeMove }} allowed collapses before your move.
  </p>
  <p class="classicalMoves">
    <strong>remaining classical moves:</strong>&nbsp;
    <span
      :class="{ low: state.playerDoubleAllowedClassical[0] <= 2 }"
      style="color: red"
      >red: {{ state.playerDoubleAllowedClassical[0] / 2 }}</span
    >
    &mdash;
    <span
      :class="{ low: state.playerDoubleAllowedClassical[1] <= 2 }"
      style="color: blue"
      >blue: {{ state.playerDoubleAllowedClassical[1] / 2 }}</span
    >
  </p>

  <Alert
    title="Illegal move!"
    message="That move is illegal! It cannot be completed in any of the possible world states."
    ref="modal"
  >
    <video
      autoplay
      preload
      width="320"
      height="431"
      ref="video"
      @click="$refs.video.play()"
      style="cursor: pointer"
    >
      <source
        src="@/assets/NeinNeinNein_large.webm"
        type="video/webm"
        media="(-webkit-min-device-pixel-ratio: 2)"
      />
      <source src="@/assets/NeinNeinNein_small.webm" type="video/webm" />
    </video>
  </Alert>
  <Alert
    title="Game Won!"
    :message="
      'Player ' +
      getCurrentPlayerColor(state.winner?.player1) +
      ' has won in all possible states of the game!'
    "
    :shouldOpen="state.winner !== undefined"
  />

  <GameExplanation ref="expl">
    <template
      v-if="state.collapsingIsMove || state.collapsesBeforeMove < Infinity"
    >
      <h3>Specials Game Rules</h3>
      <p v-if="state.collapsingIsMove">
        Collapsing a piece counts as a players move.
      </p>
      <p v-if="state.collapsesBeforeMove < Infinity">
        Each player is allowed to perform
        {{ state.collapsesBeforeMove }} collapses before performing their move.
      </p>
    </template>
  </GameExplanation>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Alert from "@/components/Alert.vue";
import GameBoard from "@/components/GameBoard.vue";
import GameExplanation from "@/components/GameExplanation.vue";
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
    Alert,
    GameBoard,
    GameExplanation,
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

<style scoped lang="scss">
h1 {
  position: sticky;
  top: 0;
  z-index: 10;

  height: 50px;
  min-width: 500px;
  margin: 10px 0;

  background: white;
  border-bottom: 1px solid black;

  span {
    top: -15px;
    position: relative;
    margin-left: 20px;
    color: blue;

    &.player1 {
      color: red;
    }
  }

  button {
    position: relative;
    top: -19px;
    margin-left: 30px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    font-weight: bold;

    cursor: pointer;
    background-color: hsl(291deg 29% 76% / 50%);
    box-shadow: 0 2px 2px rgb(0 0 0 / 20%);
    transition: box-shadow 0.1s ease;

    &:hover {
      box-shadow: 1px 3px 2px rgb(0 0 0 / 40%);
    }
  }

  img {
    cursor: pointer;
  }
}

.outOfMoves {
  color: red;
  font-weight: bold;
}

.classicalMoves {
  font-size: 20px;
  margin-bottom: 0;

  .low {
    font-weight: bold;
  }
}
</style>
