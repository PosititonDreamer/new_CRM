<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
export default {
  name: 'UForm',
  components: {UButton},
  props: {
    text: {
      type: String,
      required: true,
    }
  }
}
</script>

<template>
  <form class="u-form">
    <div class="u-form__content">
      <slot></slot>
    </div>
    <u-button class="u-form__submit" type="submit">{{text}}</u-button>
  </form>
</template>

<style lang="scss" src="./UForm.scss" scoped />