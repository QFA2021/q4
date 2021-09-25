<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <h1>Next player: {{ state.next_player ? "Red" : "Blue" }}</h1>
  <GameBoard :state="state" @place="place" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameBoard from "./components/GameBoard.vue";
import { exampleState, GameState } from "./GameState";
import { reactive } from "vue";

@Options({
  props: {
    state: {
      type: Object,
      default() {
        return reactive(exampleState);
      },
    },
  },
  components: {
    GameBoard,
  },
})
export default class App extends Vue {
  state!: GameState;

  place(column: number) {
    console.log(column);
    this.state.next_player = !this.state.next_player;
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
</style>
