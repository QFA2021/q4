<template>
  <transition name="modal">
    <div class="container" v-if="showModal" @click="clickBackground">
      <div class="wrapper">
        <h2>
          <span>{{ title }}</span>
          <button aria-label="Close" @click="showModal = false">×</button>
        </h2>
        <slot>
          <img
            src="@/assets/Title.svg"
            height="111"
            width="320"
            alt="q4 Logo"
          />
        </slot>
        <p>{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    title: String,
    message: String,
    shouldOpen: Boolean,
  },
  data() {
    return {
      showModal: this.shouldOpen,
    };
  },
  watch: {
    shouldOpen() {
      this.showModal = this.shouldOpen;
    },
  },
  mounted() {
    this._el = document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        this.showModal = false;
      }
    });
  },
  unmounted() {
    document.removeEventListener("keyup", this._el);
  },
})
export default class Alert extends Vue {
  title!: String;
  message!: String;
  showModal!: boolean;

  clickBackground(event: PointerEvent) {
    if (event.target === event.currentTarget) {
      this.showModal = false;
    }
  }
}
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  cursor: pointer;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.container:before,
.container:after {
  content: "";
  flex: 1;
}

.wrapper {
  width: 450px;
  background: white;
  border-radius: 5px;
  margin: 10px auto 0;
  cursor: default;

  max-height: calc(100vh - 20px);
  overflow-y: auto;

  will-change: transform;
  transition: transform 0.3s ease-out;
}
.modal-enter-from .wrapper {
  transform: translateY(-200px);
}
.fade-leave-active .wrapper {
  transition: transform 0.3s ease-in;
}
.modal-leave-to .wrapper {
  transform: translateY(200px);
}

h2 {
  display: flex;
  border-bottom: 1px solid gray;
  padding: 20px 50px 10px;
  margin-top: 0;
  font-size: 2rem;
}
h2 > span {
  flex: 1;
}
button {
  background: white;
  color: gray;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

p {
  padding: 20px 50px 20px;
  font-size: 1rem;
}
video + p {
  margin-top: 0;
}

img {
  animation: wiggle 1s ease-in-out infinite alternate-reverse;
}

@keyframes wiggle {
  0% {
    transform: rotate(-10deg) translateX(-10px);
  }
  100% {
    transform: rotate(10deg) translateX(10px);
  }
}
</style>
