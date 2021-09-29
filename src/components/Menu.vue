<template>
  <header>
    <transition name="fade" appear>
      <img
        src="@/assets/Title.svg"
        width="577"
        alt="q4 Logo"
        @click="$emit('backGame')"
      />
    </transition>
  </header>

  <table>
    <tr>
      <td>
        <button @click="startGame(true, Infinity)">
          <h3>Collapse as Move</h3>
          <span>Collapsing a piece or color is your move!</span>
        </button>
      </td>
    </tr>
    <tr>
      <td>
        <button @click="startGame(false, 1)">
          <h3>Single Collapse</h3>
          <span
            >You may perform a single collapse before making your move.</span
          >
        </button>
      </td>
    </tr>
    <tr>
      <td>
        <button @click="startGame(false, Infinity)">
          <h3>All Quantum</h3>
          <span>Allows all quantum moves and arbitrarily many collapses.</span>
        </button>
      </td>
    </tr>
    <tr>
      <td>
        <button @click="$refs.expl.open()">
          <h3>Show game explanation</h3>
        </button>
      </td>
    </tr>
  </table>
  <GameExplanation ref="expl" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameExplanation from "./GameExplanation.vue";
import { GameRules } from "@/GameState";

@Options({
  emits: ["startGame", "backGame"],
  components: {
    GameExplanation,
  },
})
export default class Menu extends Vue {
  startGame(collapsingIsMove: boolean, collapsesBeforeMove: number) {
    const rules: GameRules = {
      width: 7,
      height: 6,
      collapsingIsMove: collapsingIsMove,
      collapsesBeforeMove: collapsesBeforeMove,
      classicalMovesStart: 3,
      classicalMovesMaximum: 4,
    };
    this.$emit("startGame", rules);
  }
}
</script>

<style scoped>
header {
  margin-top: 20px;
}

img {
  max-width: 100%;
  cursor: pointer;
}
.fade-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-enter-from {
  opacity: 0;
  transform: rotate(45deg) scale(0.1);
}

table {
  margin: 0 auto;
}
table button {
  width: 100%;
  margin: 5px auto;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;

  font-size: 20px;
  cursor: pointer;
  background-color: hsl(291deg 29% 76% / 50%);
  box-shadow: 0 3px 5px rgb(0 0 0 / 20%);
  transition: box-shadow 0.1s ease;
}
table button:hover {
  box-shadow: 0 5px 10px rgb(0 0 0 / 40%);
}

table button h3 {
  margin: 0;
}
</style>
