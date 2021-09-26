<template>
  <h1>
    <img src="./assets/Title.svg" height="50" width="144" alt="q4 Logo" />
    <span>Next player: {{ state.next_player ? "Red" : "Blue" }}</span>
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
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameBoard from "./components/GameBoard.vue";
import Alert from "./components/Alert.vue";
import { emptyGame, GameState, Piece } from "./GameState";
import { reactive } from "vue";
import {
  collapsePiece,
  insertClassicPiece,
  insertColorPiece,
  insertSecondColorPiece,
  insertSpacePiece,
} from "./GameLogic";

@Options({
  props: {
    state: {
      type: Object,
      default() {
        return reactive(emptyGame(7, 6));
      },
    },
  },
  data() {
    return {
      colorPiece: undefined,
    };
  },
  components: {
    GameBoard,
    Alert,
  },
})
export default class App extends Vue {
  state!: GameState;
  private colorPiece?: Piece = undefined;

  placeClassical(column: number) {
    if (!insertClassicPiece(this.state, column)) {
      (this.$refs.modal as Alert).showModal = true;
    }
  }
  placeColor(column: number) {
    if (this.colorPiece === undefined) {
      // first color piece
      this.colorPiece = insertColorPiece(this.state, column);
    } else {
      // second color piece
      insertSecondColorPiece(this.state, column, this.colorPiece);
      this.colorPiece = undefined;
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
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 span {
  top: -15px;
  position: relative;
  margin-left: 20px;
}
</style>
