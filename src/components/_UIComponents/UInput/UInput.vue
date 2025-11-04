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
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    }
  },
  setup({startValue, type}, {emit}) {
    const model = ref(startValue);

    const changeModel = (e) => {
      if (type === 'text' || type === 'textarea') {
        emit('update:modelValue', model.value.trim())
        emit('input')
      }
      if (type === 'number') {
        emit('update:modelValue', model.value)
        emit('input')
      }
      if (type === 'date') {
        emit('update:modelValue', model.value)
        emit('input')
      }
      if(type === 'file') {
        model.value = e.target.files[0]
        emit('file', e.target.files[0])
      }
    }

    return {
      model, changeModel
    }
  }
}
</script>

<template>
  <label :class="['u-input', {'u-input--error': error.trim().length > 0}, {'u-input--disabled': disabled}]">
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
    <template v-else-if="type === 'file'">
      <p class="u-input__input">{{model?.name ? model?.name : "Бланк не выбран"}}</p>
      <input
          class="u-input__input"
          :type="type"
          @change="changeModel"
          accept=".pdf"
          style="display: none"
      />
    </template>
    <input
        v-else
        class="u-input__input"
        :type="type"
        v-model="model"
        @input="changeModel"
        @change="$emit('change')"
        @blur="$emit('blur')"
        :min="min"
        :max="max"
    />
    <span class="u-input__error">{{ error }}</span>
  </label>
</template>

<style scoped src="./UInput.scss" lang="scss"/>
