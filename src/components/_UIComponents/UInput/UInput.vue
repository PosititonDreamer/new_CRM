<script>

import {computed, ref} from "vue";

export default {
  name: "UInput",
  props: {
    type: {
      type: String,
      default: 'text',
      variance: ['text', 'number', 'password', 'textarea'],
    },
    title: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      default: '',
    },
    startValue: {
      type: [String, Number],
      default: '',
    }
  },
  setup({startValue, error}, {emit}) {
    const model = ref(startValue);

    const changeModel = () => {
      emit('update:modelValue', model.value.trim())
    }

    const classes = computed(() => {
      const array = ['u-input']

      if(error.trim().length > 0){
        array.push('u-input--error');
      }

      return array.join(' ');
    })

    return {
      model, changeModel, classes
    }
  }
}
</script>

<template>
  <label :class="classes">
    <span class="u-input__title">{{ title }}</span>
    <textarea
        v-if="type === 'textarea'" rows="4"
        class="u-input__input"
        v-model="model"
        @input="changeModel"
    >
    </textarea>
    <input
        v-else
        class="u-input__input"
        :type="type"
        v-model="model"
        @input="changeModel"
    />
    <span class="u-input__error">{{ error }}</span>
  </label>
</template>

<style scoped src="./UInput.scss" lang="scss"/>
