<script>
import {Auth} from "@/store/Workers/Auth.js";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";

export default {
  name: 'Assembler',
  components: {UButton, UCard},

  setup() {
    const {getWorker, logout} = Auth()


    return {
      logout, getWorker
    }
  }
}
</script>

<template>
  <div class="assembler">
    <u-button
        class="assembler__logout"
        @click="logout"
    >
      Выйти с учетной записи
    </u-button>
    <u-card
        class="assembler__card"
    >
      <p class="sub-title">Информация</p>
      <p class="text">
        <b>Имя: </b>{{getWorker.name}}
      </p>
      <p class="text">
        <b>Описание: </b>{{getWorker.description}}
      </p>
      <p class="text">
        <b>Зарплата: </b>{{getWorker.salary}} ₽ за заказ
      </p>
    </u-card>
  </div>
</template>

<style lang="scss" src="./Assembler.scss" scoped />