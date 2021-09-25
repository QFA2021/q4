<template>
  <h1>
    <img src="./assets/Title.svg" height="50" width="144" alt="q4 Logo" />
    <span>Next player: {{ state.next_player ? "Red" : "Blue" }}</span>
  </h1>
  <GameBoard
    :state="state"
    @placeClassical="placeClassical"
    @placeSpace="placeSpace"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameBoard from "./components/GameBoard.vue";
import { emptyGame, GameState } from "./GameState";
import { reactive } from "vue";
import { insertClassicPiece, insertSpacePiece } from "./GameLogic";

@Options({
  props: {
    state: {
      type: Object,
      default() {
        return reactive(emptyGame(7, 6));
      },
    },
  },
  components: {
    GameBoard,
  },
})
export default class App extends Vue {
  state!: GameState;

  placeClassical(column: number) {
    insertClassicPiece(this.state, column);
  }
  placeSpace(...columns: number[]) {
    insertSpacePiece(this.state, columns);
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
