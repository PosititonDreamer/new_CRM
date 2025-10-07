<script>
export default {
  name: "UCheckbox",
  props: {
    title: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
  setup({value}, {emit}) {

    const change = (checked) => {
      emit('change', {value, checked})
    }

    return {
      change
    }

  }
}
</script>
<template>
  <label class="u-checkbox">
    <input class="u-checkbox__input" type="checkbox" :checked="checked" :value="value" :name="name" @change="change($event.target.checked)" />
    <span class="u-checkbox__marker"></span>
    <span class="u-checkbox__text">{{title}}</span>
  </label>
</template>
<style lang="scss" src="./UCheckbox.scss" scoped />