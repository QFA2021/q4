<template>
  <Menu v-if="inMenu" @startGame="startGame" @backGame="backGame" />
  <Game v-if="!inMenu" :state="state" @toMenu="inMenu = true" />

  <footer>
    <p>
      &copy; {{ copyright }}
      <button
        @click="undo()"
        v-if="stateStack.length > 1 && !inMenu"
        aria-label="Undo"
        title="Undo"
      >
        ⭯
      </button>
    </p>
  </footer>

  <Alert title="New Version Available" ref="offer">
    <p>There is a new version available. Do you want to restart?</p>
    <template v-slot:buttons>
      <button @click="reloadNow()">Reload with new version</button>
      <button @click="$refs.offer.showModal = false">Continue</button>
    </template>
  </Alert>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Alert from "@/components/Alert.vue";
import Game from "@/components/Game.vue";
import Menu from "@/components/Menu.vue";
import { emptyGame, GameRules, GameState } from "./GameState";
import { exportState, importState } from "./GameStorage";

@Options({
  data() {
    const state =
      localStorage.lastState && process.env.NODE_ENV === "production"
        ? importState(localStorage.lastState)
        : undefined;
    return {
      inMenu: state === undefined,
      state: state,
      copyright: "",
      stateStack: [],
    };
  },
  watch: {
    state: {
      handler(current) {
        if (current !== undefined) {
          const ex = exportState(current);
          (this as App).stateStack.push(ex);
          localStorage.lastState = ex;
        }
      },
      deep: true,
    },
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
  private stateStack!: string[];

  startGame(rules: GameRules) {
    this.inMenu = false;
    this.state = emptyGame(rules);
    this.stateStack = [];
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

  undo() {
    // the current state is on top of the stack
    this.stateStack.pop();

    // also remove the previous state as it will be readded by the watcher
    const ex = this.stateStack.pop();
    if (ex !== undefined) {
      this.state = importState(ex);

      // go to menu in case of failure
      this.inMenu = this.state === undefined;
    }
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
  top: 71px;
  background: white;
}

footer {
  grid-row: 4;
  margin-top: 20px;
  border-top: 1px solid gray;

  button {
    border: none;
    border-radius: 5px;
    background: lightgray;
    margin-left: 10px;
    cursor: pointer;

    box-shadow: 2px 2px 2px rgb(0 0 0 / 20%);
    transition: box-shadow 0.1s ease;

    &:hover {
      box-shadow: 2px 2px 2px rgb(0 0 0 / 40%);
    }
  }
}
</style>
