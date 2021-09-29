<template>
  <main>
    <Menu />
    <Game v-if="false" />
  </main>

  <footer>
    <p>&copy; {{ copyright }}</p>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Game from "@/components/Game.vue";
import Menu from "@/components/Menu.vue";

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
      copyright: names.join(", ") + " " + new Date().getFullYear(),
    };
  },
  components: {
    Game,
    Menu,
  },
})
export default class App extends Vue {
  private copyright!: string;
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
main {
  min-height: 80vh;
}


tr.controls {
  position: sticky;
  z-index: 10;
  top: 50.5px;
  background: white;
}

footer {
  margin-top: 20px;
  border-top: 1px solid gray;
}
</style>
