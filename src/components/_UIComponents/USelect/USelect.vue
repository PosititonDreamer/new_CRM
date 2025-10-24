<script>
import {computed, ref, watch} from "vue";

export default {
  name: "USelect",
  props: {
    title: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      default: '',
    },
    startValue: {
      type: String,
      default: ""
    },
    values: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  setup({startValue}, { emit }) {
    const model = ref(startValue)
    const openSelect = ref(false)

    const changeValue = (value) => {
      model.value = value
      openSelect.value = false
      emit("change")
      emit("update:modelValue", value)
    }

    document.body.addEventListener("click", () => {
      openSelect.value = false
    })

    return {
      model, changeValue, openSelect
    }
  }
}
</script>

<template>
  <div :class="['u-select', {'u-select--open': openSelect}, {'u-select--error': error.trim().length > 0}, {'u-select--disabled': disabled}]">
    <p class="u-select__title" >{{title}}</p>
    <p class="u-select__value" @click="openSelect = !openSelect">
      <span>
        {{values.find(item => item.value === model)?.name}}
      </span>
      <svg width="7" height="13" viewBox="0 0 7 13" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.32002 11.2L5.52002 6.58001L1.32002 1.96002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </p>
    <div class="u-select__list" v-show="openSelect">
      <button class="u-select__item" type="button" @click.stop="changeValue('')"></button>
      <button
          v-for="item in values"
          :class="['u-select__item', {'u-select__item--active': model === item.value}]"
          @click.stop="changeValue(item.value)" type="button"
          :key="`select-item-value-${item.value}`"
      >
        {{item.name}}
      </button>
    </div>
    <p class="u-select__error" v-if="error.trim().length > 0">{{error}}</p>
  </div>
</template>

<style lang="scss" src="./USelect.scss" scoped />