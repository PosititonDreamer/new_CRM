<script>
export default {
  name: "UCard",
  props: {
    yellow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <div :class="['u-card', {'u-card--yellow': yellow}]">
    <slot></slot>
  </div>
</template>

<style lang="scss" src="./UCard.scss" scoped />