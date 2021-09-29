<template>
  <main>
    <Menu v-if="inMenu" @startGame="startGame" />
    <Game :state="state" v-if="!inMenu" @toMenu="inMenu = true" />
  </main>

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
      state: {},
      copyright: "",
    };
  },
  components: {
    Alert,
    Game,
    Menu,
  },
  watch: {
    inMenu() {
      if (process.env.NODE_ENV === "production" && !this.inMenu) {
        document.body.parentElement?.requestFullscreen();
      }
    },
  },
})
export default class App extends Vue {
  private copyright!: string;
  private inMenu!: boolean;
  private state!: GameState;

  startGame(rules: GameRules) {
    this.inMenu = false;
    this.state = emptyGame(rules);
  }

  offerReload() {
    (this.$refs.offer as Alert).showModal = true;
  }

  reloadNow() {
    location.reload();
  }

  mounted() {
    // update copyright every 10s
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

<style>
body {
  margin: 0;
}

#app {
  display: grid;
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
main {
  min-height: 80vh;
  display: grid;
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
