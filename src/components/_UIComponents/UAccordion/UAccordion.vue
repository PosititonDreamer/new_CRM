<script>
export default {
  name: "UAccordion",
  props: {
    title: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    }
  },
  setup() {

  }
}
</script>

<template>
  <div :class="['u-accordion', {'u-accordion--open': open}, {'u-accordion--small': small}]">
    <p class="u-accordion__header" @click="$emit('open')">
      <span>{{title}}</span>
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