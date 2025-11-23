<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {HookSalaries} from "@/hooks/pages/Salaries/index.js";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {computed} from "vue";

export default {
  name: "OperatorSalaries",
  components: {UAccordion, UCard, UPopup, USelect, UForm, UInput, UButton},
  setup() {
    const {
      route,
      router,
      getSalaries,
      submitFindSalaries,
      date_start,
      date_end,
    } = HookSalaries()

    const computedSalariesOperator = computed(() => {
      return {
        salaries: getSalaries.value.salaries.reduce((sum, item) => sum + +item.sum, 0),
        penalties: getSalaries.value.penalties.filter(item => item.ready).reduce((sum, item) => sum + +item.sum, 0)
      }
    })

    return {
      route,
      router,
      getSalaries,
      submitFindSalaries,
      date_start,
      date_end,
      computedSalariesOperator
    }
  }
}
</script>

<template>
  <div class="salaries">
    <u-button
        class="salaries__create"
        @click="router.push({name: 'OperatorSalariesSetting'})"
    >
      Настройки зарплаты
    </u-button>
    <div class="salaries__list" v-if="getSalaries">
      <template v-if="getSalaries.penalties.length">
        <p class="salaries__title">Расчет зарплаты за период:
          {{
            new Date(getSalaries.date_start).toLocaleDateString('ru-RU')
          }}-{{ new Date(getSalaries.date_end).toLocaleDateString('ru-RU') }}
        </p>
        <p class="salaries__sub-title salaries__sub-title--big-margin">
          Штрафы:
        </p>
        <p class="salaries__text">
          <b>Всего штрафов за выбранный период: </b> {{ getSalaries.penalties.length }}
        </p>
        <p class="salaries__text">
          <b>Исполненных штрафов за выбранный период: </b> {{ getSalaries.penalties.filter(item => item.ready).length }}
        </p>
        <p class="salaries__text">
          <b>Не исполненных штрафов за выбранный период: </b>
          {{ getSalaries.penalties.filter(item => !item.ready).length }}
        </p>
        <p class="salaries__text">
          <b>Всего не исполненных штрафов: </b> {{ getSalaries.penalties_length }}
        </p>
      </template>
      <p class="salaries__sub-title salaries__sub-title--big-margin">
        Расчеты:
      </p>
      <p class="salaries__text">
        <b>Всего оплачено: </b> {{ computedSalariesOperator.salaries - computedSalariesOperator.penalties }} ₽
        <template v-if="computedSalariesOperator.penalties">
          ({{ computedSalariesOperator.salaries }} - {{ computedSalariesOperator.penalties }})
        </template>
      </p>
      <p class="salaries__sub-title salaries__sub-title--big-margin">
        Списки:
      </p>
      <u-card
          class="salaries__card"
          v-if="getSalaries.penalties.filter(item => !item.ready).length"
      >
        <u-accordion
            title="Не исполненные штрафы"
            :open="!!getSalaries.openPenalties"
            @open="getSalaries.openPenalties = !getSalaries.openPenalties"
        >
          <u-card class="salaries__item" v-for="penalty in getSalaries.penalties.filter(item => !item.ready)">
            <p class="salaries__text">
              <b>Сумма штрафа: </b> {{ penalty.sum }} ₽
            </p>
            <p class="salaries__text">
              <b>Описание: </b>{{ penalty.description }}
            </p>
          </u-card>
        </u-accordion>
      </u-card>
      <u-card
          class="salaries__card"
          v-if="getSalaries.salaries.length"
      >
        <u-accordion
            title="Выплаты"
            :open="!!getSalaries.openSalaries"
            @open="getSalaries.openSalaries = !getSalaries.openSalaries"
        >
          <u-card class="salaries__item" v-for="salary in getSalaries.salaries">
            <p class="salaries__text">
              <b>Сумма: </b> {{ salary.sum }} ₽
            </p>
            <p class="salaries__text">
              <b>Описание: </b>{{ salary.description }}
            </p>
            <p class="salaries__text">
              <b>Период: </b>{{ new Date(salary.date_start).toLocaleDateString('ru-RU') }} -
              {{ new Date(salary.date_end).toLocaleDateString('ru-RU') }}
            </p>
          </u-card>
        </u-accordion>
      </u-card>
      <u-card
          class="salaries__card"
          v-if="getSalaries.penalties.filter(item => item.ready).length"
      >
        <u-accordion
            title="Исполненные штрафы"
            :open="!!getSalaries.openPenaltiesReady"
            @open="getSalaries.openPenaltiesReady = !getSalaries.openPenaltiesReady"
        >
          <u-card class="salaries__item" v-for="penalty in getSalaries.penalties.filter(item => item.ready)">
            <p class="salaries__text">
              <b>Сумма штрафа: </b> {{ penalty.sum }} ₽
            </p>
            <p class="salaries__text">
              <b>Описание: </b>{{ penalty.description }}
            </p>
          </u-card>
        </u-accordion>
      </u-card>
    </div>
    <u-popup
        v-if="route.name === 'OperatorSalariesSetting'"
        title="Настройка поиска"
        @close="router.push({name: 'OperatorSalaries'})"
    >
      <u-form
          text="Найти зарплату"
          @submit.prevent="submitFindSalaries('OperatorSalaries')"
      >
        <u-input
            title="Минимальная дата"
            type="date"
            :max="new Date().toISOString().split('T')[0]"
            :start-value="date_start.value"
            v-model="date_start.value"
            :error="date_start.error"
            @change="date_start.tacked = true"
        />
        <u-input
            title="Максимальная дата"
            type="date"
            :min="date_start.value ? date_start.value: ''"
            :max="new Date().toISOString().split('T')[0]"
            :start-value="date_end.value"
            v-model="date_end.value"
            :error="date_end.error"
            @change="date_end.tacked = true"
        />
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./Salaries.scss" scoped />