<script>
import {computed} from "vue";

export default {
  name: "UButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default',
      variance: ['default', 'big']
    },
    modifier: {
      type: String,
      default: 'default',
      variance: ['default', 'yellow', 'red']
    }
  },
  setup({size, modifier},) {

    const classes = computed(() => {
      const array = ['u-button'];

      if (size !== 'default') {
        array.push(`u-button--${size}`);
      }
      if (modifier !== 'default') {
        array.push(`u-button--${modifier}`);
      }

      return array.join(' ');

    })

    return {
      classes
    }
  }
}
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<style scoped src="./UButton.scss" lang="scss"/>
