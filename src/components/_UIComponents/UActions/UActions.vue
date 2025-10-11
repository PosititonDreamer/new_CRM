<script>
import {ref} from "vue";

export default {
  name: "UActions",
  props: {
    actions: {
      type: Array,
      required: true
    }
  },
  setup(_, { emit }) {
    const openActions = ref(false)

    document.body.addEventListener("click", () => {
      openActions.value = false
    })

    window.addEventListener("keydown", (e) => {
      if(e.key === "Escape") {
        openActions.value = false
      }
    });

    const clickAction = (name) => {
      openActions.value = false
      emit(name);
    }

    return {
      openActions, clickAction
    }
  }
}
</script>

<template>
  <div class="u-actions">
    <button class="u-actions__button" @click.stop="openActions = !openActions">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="u-actions__list" v-show="openActions">
      <button v-for="action in actions" @click.stop="clickAction(action.name)">{{action.text}}</button>
    </div>
  </div>
</template>

<style lang="scss" src="./UActions.scss" scoped />