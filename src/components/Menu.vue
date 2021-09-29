<template>
  <header>
    <!-- TODO: specify width -->
    <transition name="fade" appear>
      <img src="@/assets/Title.svg" height="200" alt="q4 Logo" />
    </transition>
  </header>

  <table>
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
        <button @click="startGame(true, Infinity)">
          <h3>Collapse as Move</h3>
          <span>Collapsing a piece or color is your move!</span>
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
  </table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  emits: ["startGame"],
})
export default class Menu extends Vue {
  startGame(collapsingIsMove: boolean, collapsesBeforeMove: number) {
    this.$emit("startGame", {
      width: 7,
      height: 6,
      collapsingIsMove: collapsingIsMove,
      collapsesBeforeMove: collapsesBeforeMove,
    });
  }
}
</script>

<style scoped>
header {
  margin-top: 20px;
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
