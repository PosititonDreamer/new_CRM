<script>

import {PlanPacking} from "@/store/Admin/PlanPacking/PlanPacking.js";
import {HookPlanPacking} from "@/hooks/pages/PlanPacking/index.js";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {watch} from "vue";

export default {
  components: {UButton, UInput, UForm, UPopup},
  async beforeCreate() {
    const {
      findPackingMinDate
    } = PlanPacking()


    await findPackingMinDate()
  },
  setup() {
    const {
      computedPackings,
      getMinDate,
      router,
      route,
      date_start,
      date_end,
      period,
      submitFindPacking,
      columnsDays,
      getPacking,
    } = HookPlanPacking()

    const changeRoute = (to) => {
      if (to.name === 'PlanPacking') {
        date_start.value.value = ''
        date_end.value.value = ''
        period.value.value = 0

        date_start.value.tacked = false
        date_end.value.tacked = false
        period.value.tacked = false
      }
    }

    watch(route, () => {
      changeRoute(route.name)
    })

    changeRoute(route.name)

    return {
      computedPackings,
      route,
      router,
      getMinDate,
      date_end,
      date_start,
      period,
      submitFindPacking,
      columnsDays,
      getPacking,
    }
  }
}
</script>

<template>
  <div class="plan-packing">
    <div class="plan-packing__actions">
      <u-button
          @click="router.push({name: 'PlanPackingSetting'})"
      >
        Настройки плана упаковок
      </u-button>
    </div>
    <div class="plan-packing__wrapper" v-if="getPacking">
      <p class="plan-packing__sub-title">Расчет расходов с {{getPacking.date_start.split('-').reverse().join('.')}} до {{getPacking.date_end.split('-').reverse().join('.')}}</p>
      <p class="plan-packing__sub-title">{{ getPacking.days }} дней</p>
      <div class="list" :style="`--columns: ${columnsDays.length}`">
        <p class="plan-packing__title">Фасованные продукты</p>
        <div class="plan-packing__table">
          <div class="plan-packing__item plan-packing__item--head">
            <div class="plan-packing__column">
              Название
            </div>
            <div class="plan-packing__column">
              Расход
            </div>
            <div class="plan-packing__column"  v-for="day in columnsDays">
              {{ day }} дней
            </div>
          </div>
          <div class="plan-packing__item" v-for="packing in computedPackings">
            <div class="plan-packing__column plan-packing__column--big" :style="`--rows: ${packing.list.length + 1}`">
              {{ packing.title }}
            </div>
            <template v-for="product in packing.list">
              <div class="plan-packing__column">
                {{ product.quantity }} {{packing.measure}}
              </div>
              <div class="plan-packing__column">
                {{ product.sum_day }}
              </div>
              <div class="plan-packing__column plan-packing__column--center"  v-for="day in columnsDays">
                {{ (day * product.sum_day - product.current_balance) > 0 ? Math.ceil((day * product.sum_day - product.current_balance)) : 0 }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <u-popup
        v-if="route.name === 'PlanPackingSetting'"
        title="Настройки плана упаковок"
        @close="router.push({name: 'PlanPacking'})"
    >
      <u-form
          text="Настроить план упаковок"
          @submit.prevent="submitFindPacking"
      >
        <div class="list">
          <u-input
              title="Минимальная дата"
              type="date"
              :min="getMinDate"
              :max="date_end.value ? date_end.value: new Date().toISOString().split('T')[0]"
              :start-value="date_start.value"
              v-model="date_start.value"
              :error="date_start.error"
              @change="date_start.tacked = true"
          />
          <u-input
              title="Максимальная дата"
              type="date"
              :min="date_start.value ? date_start.value: getMinDate"
              :max="new Date().toISOString().split('T')[0]"
              :start-value="date_end.value"
              v-model="date_end.value"
          />
          <u-input
              title="Период для расчета (дни)"
              type="number"
              v-model="period.value"
              :start-value="period.value"
              @blur="period.tacked = true"
              :error="period.error"
              @change="period.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./PlanPacking.scss" scoped/>