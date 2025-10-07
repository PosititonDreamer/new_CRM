<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import {ref} from "vue";

export default {
  components: {UInput, UButton},
  setup() {
    const text = ref("");
    const area = ref("");

    return {
      text, area
    }
  }
}
</script>

<template>
  <div class="UI">
    <div class="UI__item">
      <u-button>Кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button disabled>Заблокированная Кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button size="big">Большая кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button size="big" disabled>Большая заблокированная кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button modifier="yellow">Желтая кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button disabled modifier="yellow">Желтая заблокированная Кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button size="big" modifier="yellow">Желтая большая кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button size="big" modifier="yellow" disabled>Желтая большая заблокированная кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button modifier="red">Красная кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button disabled modifier="red">Красная заблокированная Кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button size="big" modifier="red">Красная большая кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-button size="big" modifier="red" disabled>Красная большая заблокированная кнопка</u-button>
    </div>
    <div class="UI__item">
      <u-input title="Текстовое поле" v-model="text" :start-value="text"/>
    </div>
    <div class="UI__item">
      <u-input type="textarea" title="Текстовое поле" v-model="area" error="Ошибка" :start-value="area"/>
    </div>
  </div>
</template>

<style lang="scss" src="./UI.scss" scoped />
