<script>
import {ref} from "vue";

export default {
  name: "UAccordion",
  props: {
    title: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const open = ref(false)

    return {
      open
    }
  }
}
</script>

<template>
  <div :class="['u-accordion', {'u-accordion--small': small}]">
    <p :class="['u-accordion__header', {'u-accordion__header--open': open}]" @click="open = !open">
      <span :class="`${small ? 'text text--bold' : 'sub-title'}`">{{title}}</span>
      <svg width="7" height="13" viewBox="0 0 7 13" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.32002 11.2L5.52002 6.58001L1.32002 1.96002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </p>
    <div class="u-accordion__content" v-show="open">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" src="./UAccordion.scss" scoped />