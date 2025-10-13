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
  setup({startValue, type}, {emit}) {
    const model = ref(startValue);

    const changeModel = () => {
      if (type === 'text' || type === 'textarea') {
        emit('update:modelValue', model.value.trim())
      }
      if (type === 'number') {
        emit('update:modelValue', model.value)
      }
    }

    return {
      model, changeModel
    }
  }
}
</script>

<template>
  <label :class="['u-input', {'u-input--error': error.trim().length > 0}]">
    <span class="u-input__title">{{ title }}</span>
    <textarea
        v-if="type === 'textarea'" rows="4"
        class="u-input__input"
        v-model="model"
        @input="changeModel"
        @change="$emit('change')"
        @blur="$emit('blur')"
    >
      {{model}}
    </textarea>
    <input
        v-else
        class="u-input__input"
        :type="type"
        v-model="model"
        @input="changeModel"
        @change="$emit('change')"
        @blur="$emit('blur')"
    />
    <span class="u-input__error">{{ error }}</span>
  </label>
</template>

<style scoped src="./UInput.scss" lang="scss"/>
