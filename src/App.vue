<template>
  <Menu v-if="inMenu" @startGame="startGame" @backGame="backGame" />
  <Game v-if="!inMenu" :state="state" @toMenu="inMenu = true" />

  <footer>
    <p>&copy; {{ copyright }}</p>
  </footer>

  <Alert title="New Version Available" ref="offer">
    <p>There is a new version available. Do you want to restart?</p>
    <button @click="reloadNow()">Reload with new version</button>
    <button @click="$refs.offer.showModal = false">Continue</button>
  </Alert>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Alert from "@/components/Alert.vue";
import Game from "@/components/Game.vue";
import Menu from "@/components/Menu.vue";
import { emptyGame, GameRules, GameState } from "./GameState";

@Options({
  data() {
    return {
      inMenu: true,
      state: undefined,
      copyright: "",
    };
  },
  components: {
    Alert,
    Game,
    Menu,
  },
})
export default class App extends Vue {
  private copyright!: string;
  private inMenu!: boolean;
  private state?: GameState;

  startGame(rules: GameRules) {
    this.inMenu = false;
    this.state = emptyGame(rules);
  }

  backGame() {
    if (this.state !== undefined) {
      this.inMenu = false;
    }
  }

  // called when service worker has updated
  offerReload() {
    (this.$refs.offer as Alert).showModal = true;
  }

  reloadNow() {
    location.reload();
  }

  // update copyright every 10s
  mounted() {
    this.randomCopyright();
  }

  randomCopyright() {
    // shuffle names
    const names = ["Magnus Kühn", "Robert Junge", "Hazem Riahi"];
    for (let i = names.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      const temp = names[i];
      names[i] = names[j];
      names[j] = temp;
    }

    this.copyright = names.join(", ") + " " + new Date().getFullYear();

    // update copyright every 10s while tab is active
    requestAnimationFrame(() =>
      setTimeout(this.randomCopyright.bind(this), 10000)
    );
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  min-height: 100vh;
  display: grid;
  grid-template-rows: max-content max-content 1fr max-content;

  // force the horizontal overflow to go somewhere
  // otherwise the entire page becomes much taller for some reason
  overflow-y: auto;
}

// game control headers
tr.controls {
  position: sticky;
  z-index: 10;
  top: 70.5px;
  background: white;
}

footer {
  grid-row: 4;
  margin-top: 20px;
  border-top: 1px solid gray;
}
</style>
