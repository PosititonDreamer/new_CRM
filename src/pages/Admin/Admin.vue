<script>
import {Auth} from "@/store/Workers/Auth.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";

export default {
  name: 'Admin',
  components: {UCard, UButton},
  setup() {
    const {getWorker, logout} = Auth()

    return {
      logout, getWorker
    }
  }
}
</script>

<template>
  <div class="admin">
    <u-button
        class="admin__logout"
        @click="logout"
    >
      Выйти с учетной записи
    </u-button>
    <u-card
        class="admin__card"
    >
      <p class="sub-title">Информация</p>
      <p class="text">
        <b>Имя: </b>{{getWorker.name}}
      </p>
      <p class="text">
        <b>Описание: </b>{{getWorker.description}}
      </p>
    </u-card>
  </div>
</template>
<style lang="scss" src="./Admin.scss" scoped />