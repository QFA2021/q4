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
        <button>
          <h3>Single Collapse</h3>
          <span
            >You may perform a single collapse before making your move.</span
          >
        </button>
      </td>
    </tr>
    <tr>
      <td>
        <button>
          <h3>Collapse as Move</h3>
          <span>Collapsing a piece or color is your move!</span>
        </button>
      </td>
    </tr>
    <tr>
      <td>
        <button>
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
  data() {
    return {};
  },
})
export default class Menu extends Vue {}
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
  border-radius: 5px;

  font-size: 20px;
  cursor: pointer;
  background-color: darkorange;
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
