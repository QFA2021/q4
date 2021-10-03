<template>
  <transition
    name="modal"
    @after-enter="afterFadeIn"
    @before-leave="beforeFadeOut"
  >
    <div class="container" v-if="showModal" @click="clickBackground">
      <div class="wrapper">
        <h2 @click="showModal = false">
          <span>{{ title }}</span>
          <button aria-label="Close">×</button>
        </h2>
        <div class="content">
          <slot>
            <img
              src="@/assets/Title.svg"
              height="111"
              width="320"
              alt="q4 Logo"
            />
          </slot>
          <p v-if="message">{{ message }}</p>
          <slot name="buttons"></slot>
        </div>
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
      showDone: false,
    };
  },
  watch: {
    shouldOpen() {
      this.showModal = this.shouldOpen;
    },
  },
})
export default class Alert extends Vue {
  title!: String;
  message!: String;
  shouldOpen!: Boolean;
  showModal!: Boolean;
  showDone!: Boolean;
  private keyboardEL: any;

  clickBackground(event: PointerEvent) {
    if (this.showDone && event.target === event.currentTarget) {
      this.showModal = false;
    }
  }

  afterFadeIn() {
    this.showDone = true;
    this.keyboardEL = document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        this.showModal = false;
      }
    });
  }
  beforeFadeOut() {
    this.showDone = false;
    document.removeEventListener("keyup", this.keyboardEL);
    this.keyboardEL = undefined;
  }
}
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: auto;

  display: flex;
  flex-direction: column;

  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  cursor: pointer;

  &::before,
  &::after {
    content: "";
    flex: 1;
  }
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.wrapper {
  max-height: calc(100vh - 20px);
  width: 450px;
  max-width: 100%;
  background: white;
  border-radius: 5px;
  margin: 10px auto;
  padding-bottom: 20px;
  cursor: default;
  overflow-y: auto;

  will-change: transform;
  transition: transform 0.3s ease-out;
}
@media screen and (max-width: 450px) {
  .wrapper {
    margin: 0 auto;
  }
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
  margin-top: 0;
  padding: 20px 20px 10px;
  font-size: 2rem;
  cursor: pointer;

  position: sticky;
  top: 0;
  background: white;

  > span {
    flex: 1;
  }

  button {
    background: white;
    color: gray;
    border: none;
    font-size: 2rem;
    cursor: pointer;
  }
}

p {
  margin: 0;
  padding: 20px 0 0;
  font-size: 1rem;
}

.content {
  padding: 0 20px;
  :deep(button) {
    margin: 10px 5px 0;
    padding: 10px;
    border: none;
    border-radius: 10px;
    font-weight: bold;

    cursor: pointer;
    background-color: hsl(291deg 29% 76% / 50%);
    box-shadow: 0 2px 2px rgb(0 0 0 / 20%);
    transition: box-shadow 0.1s ease;
  }
  :deep(button:hover) {
    box-shadow: 1px 3px 2px rgb(0 0 0 / 40%);
  }
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
