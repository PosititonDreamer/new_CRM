<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";

export default {
  components: {UButton},
  setup() {


    return {}
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
  </div>
</template>

<style lang="scss" src="./UI.scss" scoped />
