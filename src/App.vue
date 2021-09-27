<template>
  <h1>
    <img src="./assets/Title.svg" height="50" width="144" alt="q4 Logo" />
    <span :class="{ player1: state.next_player }"
      >Next player: {{ state.next_player ? "Red" : "Blue" }}</span
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

  <footer>
    <p>&copy; {{ copyright }}</p>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameBoard from "./components/GameBoard.vue";
import Alert from "./components/Alert.vue";
import { emptyGame, GameState, Piece } from "./GameState";
import {
  collapsePiece,
  insertClassicPiece,
  insertColorPiece,
  insertSecondColorPiece,
  insertSpacePiece,
} from "./GameLogic";

@Options({
  data() {
    // shuffle names
    const names = ["Magnus Kühn", "Robert Junge", "Hazem Riahi"];
    for (let i = names.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      const temp = names[i];
      names[i] = names[j];
      names[j] = temp;
    }

    return {
      state: emptyGame(7, 6),
      colorPiece: undefined,
      copyright: names.join(", ") + " " + new Date().getFullYear(),
    };
  },
  components: {
    GameBoard,
    Alert,
  },
})
export default class App extends Vue {
  state!: GameState;
  colorPiece?: Piece = undefined;
  private copyright!: string;

  placeClassical(column: number) {
    if (!insertClassicPiece(this.state, column)) {
      (this.$refs.modal as Alert).showModal = true;
    }
  }
  placeColor(column: number) {
    if (this.colorPiece === undefined) {
      // first color piece
      this.colorPiece = insertColorPiece(this.state, column);
      if (this.colorPiece === undefined) { // illegal move
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
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 {
  position: sticky;
  top: 0;
  z-index: 10;

  height: 50px;
  margin: 10px 0;

  background: white;
  border-bottom: 1px solid black;
}
tr.controls {
  position: sticky;
  z-index: 10;
  top: 50.5px;
  background: white;
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

footer {
  margin-top: 20px;
  border-top: 1px solid gray;
}
</style>
