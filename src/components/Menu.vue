<template>
  <header>
    <transition name="fade" appear>
      <img
        src="@/assets/Title.svg"
        width="577"
        height="202"
        alt="q4 Logo"
        @click="$emit('backGame')"
        :style="{ cursor: mayContinue ? 'pointer' : undefined }"
      />
    </transition>
  </header>

  <main>
    <button @click="$emit('backGame')" v-if="mayContinue" class="resumeButton">
      <h3>Continue last game</h3>
    </button>
    <button @click="startGame(true, Infinity)">
      <h3>Collapse as Move</h3>
      <span>Collapsing a piece or color is your move!</span>
    </button>
    <button @click="startGame(false, 1)">
      <h3>Single Collapse</h3>
      <span>You may perform a single collapse before making your move.</span>
    </button>
    <button @click="startGame(false, Infinity)">
      <h3>All Quantum</h3>
      <span>Allows all quantum moves and arbitrarily many collapses.</span>
    </button>
    <div>
      <button @click="$refs.expl.open()">
        <h3>Show game explanation</h3>
      </button>
      <button @click="$refs.expl.open('about')">
        <h3>About</h3>
      </button>
    </div>
  </main>
  <GameExplanation ref="expl" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameExplanation from "./GameExplanation.vue";
import { GameRules } from "@/GameState";

@Options({
  props: {
    mayContinue: Boolean,
  },
  emits: ["startGame", "backGame"],
  components: {
    GameExplanation,
  },
})
export default class Menu extends Vue {
  mayContinue!: Boolean;

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

<style scoped lang="scss">
header {
  margin: 10px 0;
}

img {
  max-width: calc(100% - 20px);
  margin: 10px;
}
.fade-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-enter-from {
  opacity: 0;
  transform: rotate(45deg) scale(0.1);
}

main {
  display: grid;
  // just max-content breaks word-wrapping, see https://github.com/rachelandrew/gridbugs/issues/46
  grid-template-columns: minmax(0, max-content);
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;

  gap: 20px;
  justify-content: space-around;

  > div {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;

  font-size: 20px;
  cursor: pointer;
  background-color: hsl(291deg 29% 76% / 50%);
  box-shadow: 0 3px 5px rgb(0 0 0 / 20%);
  transition: box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0 5px 10px rgb(0 0 0 / 40%);
  }

  h3 {
    margin: 0;
  }

  &.resumeButton {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-template-rows: 1fr;
    justify-content: center;
    align-items: center;
    gap: 10px;

    &:before {
      content: "";
      border-style: solid;
      border-width: 0.8em 0 0.8em 1.2em;
      border-color: transparent transparent transparent black;

      transition: transform 0.1s ease, opacity 0.1s ease;
      opacity: 0.8;
    }

    &:hover:before {
      transform: translateX(5px);
      opacity: 1;
    }
  }
}
</style>
