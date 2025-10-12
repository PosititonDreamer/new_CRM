<script>
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import {ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {useRoute, useRouter} from "vue-router";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import {HookMeasureUnits} from "@/hooks/pages/MeasureUnits/index.js";

export default {
  name: "MeasureUnits",
  components: {UAlert, UForm, UInput, UPopup, UButton, UActions, UCard},
  async beforeCreate() {
    const {findMeasureUnits} = MeasureUnits()

    await findMeasureUnits()
  },
  setup() {
    const {getMeasureUnits} = MeasureUnits()
    const {title, deleteMeasureUnitsId, submitCreateMeasureUnit, submitUpdateMeasureUnit, deleteMeasureUnits} = HookMeasureUnits()

    const router = useRouter()
    const route = useRoute()

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "remove",
        text: "Удалить"
      }
    ])

    const changeRoute = (to) => {
      if(to.name === 'MeasureUnitsUpdate' && to.params.id){
        if(!getMeasureUnits.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const measureUnit = getMeasureUnits.value.find(measureUnit => measureUnit.id === to.params.id)
        title.value.value = measureUnit.title
        title.value.tacked = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      getMeasureUnits,
      actions,
      router,
      route,
      title,
      submitCreateMeasureUnit,
      submitUpdateMeasureUnit,
      deleteMeasureUnitsId,
      deleteMeasureUnits,
    }
  }

}
</script>

<template>
  <div class="measure-units">
    <u-button class="measure-units__create" @click="router.push({name: 'MeasureUnitsCreate'})">Добавить единицу
      измерения
    </u-button>
    <!-- todo: Список -->
    <div class="measure-units__list">
      <u-card
          v-for="(measureUnit, id) in getMeasureUnits"
          class="measure-units__item"
          :key="`measure-units-${measureUnit.id}`"
          :style="[{'--z-index': getMeasureUnits.length - id}]"
      >
        <p class="measure-units__title">
          {{ measureUnit.title }}
        </p>
        <u-actions
            class="measure-units__actions"
            :actions="actions"
            @remove="deleteMeasureUnitsId = measureUnit.id"
            @update="router.push({name: 'MeasureUnitsUpdate', params:{id: measureUnit.id}})"
            :key="`measure-units-actions-${measureUnit.id}`"/>
      </u-card>
    </div>
  </div>
  <!-- todo: Подтверждение удаления -->
  <u-alert
      v-if="deleteMeasureUnitsId"
      title="Удалить единицу измеренеия?"
      type="confirm"
      @close="deleteMeasureUnitsId = null"
      @accept="deleteMeasureUnits()"/>
  <!-- todo: Добавление -->
  <u-popup
      v-if="route.name === 'MeasureUnitsCreate'"
      title="Добавление единицы измеренеия"
      @close="router.push({name: 'MeasureUnits'})">
    <u-form
        class="measure-units__form"
        @submit.prevent="submitCreateMeasureUnit"
        text="Добавить единицу измеренеия">
      <u-input
          title="Название"
          v-model="title.value"
          :start-value="title.value"
          @blur="title.tacked = true"
          @change="title.tacked = true"
          :error="title.error"
      />
    </u-form>
  </u-popup>
  <!-- todo: Редактирование -->
  <u-popup
      v-if="route.name === 'MeasureUnitsUpdate' && getMeasureUnits.find(measure => measure.id === route.params.id) && title.value"
      title="Изменение единицы измеренеия"
      @close="router.push({name: 'MeasureUnits'})"
  >
    <u-form
        class="measure-units__form"
        @submit.prevent="submitUpdateMeasureUnit"
        text="Изменить единицу измеренеия">
      <u-input
          title="Название"
          v-model="title.value"
          :start-value="title.value"
          @blur="title.tacked = true"
          @change="title.tacked = true"
          :error="title.error"
      />
    </u-form>
  </u-popup>
</template>

<style lang="scss" src="./MeasureUnits.scss" scoped/>