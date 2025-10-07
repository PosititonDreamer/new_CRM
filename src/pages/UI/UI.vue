<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import {ref} from "vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";

export default {
  components: {UAlert, UPopup, UCheckbox, UInput, UButton},
  setup() {
    const text = ref("");
    const area = ref("");
    const checkBoxes = ref([1, 3])
    const popup = ref(false)
    const alert = ref(false)
    const confirm = ref(false)

    const changeCheckbox = (e) => {
      if(e.checked) {
        checkBoxes.value.push(e.value)
      } else {
        checkBoxes.value = checkBoxes.value.filter(check => check !== e.value)
      }
    }

    return {
      text, area, checkBoxes, changeCheckbox, popup, alert, confirm
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
    <div class="UI__item">
      <u-checkbox title="Чекбокс 1" key="ui-check-1" name="ui" value="1" :checked="!!checkBoxes.find(check => check === 1)" @change="changeCheckbox"/>
    </div>
    <div class="UI__item">
      <u-checkbox title="Чекбокс 2" key="ui-check-2" name="ui" value="2" :checked="!!checkBoxes.find(check => check === 2)" @change="changeCheckbox"/>
    </div>
    <div class="UI__item">
      <u-checkbox title="Чекбокс 3" key="ui-check-3" name="ui" value="3" :checked="!!checkBoxes.find(check => check === 3)" @change="changeCheckbox"/>
    </div>
    <div class="UI__item">
      <u-button @click="popup = true">Открыть попап</u-button>
      <u-popup v-if="popup" title="ui попап" @close="popup = false">
        <p>Тут будут тестовые данные</p>
        <u-button modifier="red">Красная кнопка</u-button>
        <u-input title="Текстовое поле" v-model="text" :start-value="text"/>
      </u-popup>
    </div>
    <div class="UI__item">
      <u-button @click="alert = true">Показать алерт</u-button>
      <u-alert v-if="alert" title="Открыт алерт" @close="alert = false"/>
    </div>
    <div class="UI__item">
      <u-button @click="confirm = true">Открыть конфирм</u-button>
      <u-alert v-if="confirm" type="confirm" title="Открыт конфирм" @close="confirm = false" @accept="() => {confirm = false; console.log('accept')}"/>
    </div>
  </div>
</template>

<style lang="scss" src="./UI.scss" scoped />
