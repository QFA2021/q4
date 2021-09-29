<template>
  <Alert title="Game Rules" message="" ref="alert">
    <slot></slot>

    <h3>General Gameplay</h3>
    <p>TODO: here are the game rules</p>
  </Alert>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Alert from "./Alert.vue";

@Options({
  components: {
    Alert,
  },
})
export default class GameExplanation extends Vue {
  open() {
    (this.$refs.alert as Alert).showModal = true;
  }
}
</script>
