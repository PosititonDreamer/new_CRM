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
import {Auth} from "@/store/Workers/Auth.js";

export default {
  name: "AssemblerSalaries",
  components: {UAccordion, UCard, UPopup, USelect, UForm, UInput, UButton},
  setup() {
    const {
      getSalaries,
      route,
      router,
      submitFindSalaries,
      date_start,
      date_end,
    } = HookSalaries()

    const {getWorker} = Auth()

    const computedSalaryWorker = computed(() => {
      return +getWorker.value.salary
    })

    const computedPaySalaryWorker = computed(() => {
      const penalties = getSalaries.value.penalties.filter(item => item.ready)
      const salaries = getSalaries.value.salaries.filter(item => item.ready)
      return {
        salary: salaries.length ? salaries.length * computedSalaryWorker.value : 0,
        penalty: penalties?.length ? penalties.reduce((sum, item) => sum + +item.sum, 0) : 0
      }
    })
    
    const computedNotPaySalaryWorker = computed(() => {
      const penalties = getSalaries.value.penalties.filter(item => !item.ready)
      const salaries = getSalaries.value.salaries.filter(item => !item.ready)
      return {
        salary: salaries.length ? salaries.length * computedSalaryWorker.value : 0,
        penalty: penalties.length ? penalties.reduce((sum, item) => sum + +item.sum, 0) : 0
      }
    })
    
    
    return {
      getSalaries,
      route,
      router,
      submitFindSalaries,
      date_start,
      date_end,
      computedSalaryWorker,
      computedPaySalaryWorker,
      computedNotPaySalaryWorker
    }
  }
}
</script>
<template>
  <div class="salaries">
    <u-button
        class="salaries__create"
        @click="router.push({name: 'AssemblerSalariesSetting'})"
    >
      Настройки зарплаты
    </u-button>
    <div class="salaries__list" v-if="getSalaries">
      <p class="salaries__title">Расчет зарплаты за период:
        {{
          new Date(getSalaries.date_start).toLocaleDateString('ru-RU')
        }}-{{ new Date(getSalaries.date_end).toLocaleDateString('ru-RU') }}
      </p>
      <p class="salaries__sub-title salaries__sub-title--big-margin">
        Заказы:
      </p>
      <p class="salaries__text">
        <b>Всего заказов за выбранный период: </b> {{ getSalaries.salaries.length }}
      </p>
      <p class="salaries__text">
        <b>Оплаченных заказов за выбранный период: </b> {{ getSalaries.salaries.filter(item => item.ready).length }}
      </p>
      <p class="salaries__text">
        <b>Неоплаченных заказов за выбранный период: </b>
        {{ getSalaries.salaries.filter(item => !item.ready || !item.send).length }}
      </p>
      <p class="salaries__text">
        <b>Всего неоплаченных заказов: </b> {{ getSalaries.salaries_length }}
      </p>
      <template v-if="getSalaries.penalties.length">
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
        <b>Стоимость одного заказа: </b> {{computedSalaryWorker}} ₽
      </p>

      <p class="salaries__text">
        <b>Формула расчета: </b> Сумма заказов * стоимость одного заказа - сумма штрафов
      </p>
      <p class="salaries__text">
        <b>Оплачено: </b> {{ computedPaySalaryWorker.salary - computedPaySalaryWorker.penalty }} ₽
        <template v-if="computedPaySalaryWorker.penalty">
          ({{ computedPaySalaryWorker.salary }} - {{ computedPaySalaryWorker.penalty }})
        </template>
      </p>

      <p class="salaries__text">
        <b>Не оплачено: </b> {{ computedNotPaySalaryWorker.salary - computedNotPaySalaryWorker.penalty }} ₽
        <template v-if="computedNotPaySalaryWorker.penalty">
          ({{ computedNotPaySalaryWorker.salary }} - {{ computedNotPaySalaryWorker.penalty }})
        </template>
      </p>

      <p class="salaries__text">
        <b>Общая сумма: </b>
        {{ (computedPaySalaryWorker.salary + computedNotPaySalaryWorker.salary) - (computedPaySalaryWorker.penalty + computedNotPaySalaryWorker.penalty) }}
        ₽
        <template v-if="computedNotPaySalaryWorker.penalty || computedPaySalaryWorker.penalty">
          ({{ computedPaySalaryWorker.salary + computedNotPaySalaryWorker.salary }} -
          {{ computedPaySalaryWorker.penalty + computedNotPaySalaryWorker.penalty }})
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
          v-if="getSalaries.salaries.filter(item => !item.ready).length"
      >
        <u-accordion
            title="Не оплаченные заказы"
            :open="!!getSalaries.openSalaries"
            @open="getSalaries.openSalaries = !getSalaries.openSalaries"
        >
          <u-card class="salaries__item" v-for="salary in getSalaries.salaries.filter(item => !item.ready)">
            <p class="salaries__title">
              {{ salary.track }}
            </p>
            <p class="salaries__text">
              <b>ФИО: </b> {{ salary.full_name }}
            </p>
            <p class="salaries__text">
              <b>Дата создания заказа: </b> {{ new Date(salary.date).toLocaleDateString('ru-RU') }}
            </p>
            <p class="salaries__text">
              <b>
                {{ salary.send ? 'Отправлен' : 'Не отправлен' }}
              </b>
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
      <u-card
          class="salaries__card"
          v-if="getSalaries.salaries.filter(item => item.ready).length"
      >
        <u-accordion
            title="Оплаченные заказы"
            :open="!!getSalaries.openSalariesReady"
            @open="getSalaries.openSalariesReady = !getSalaries.openSalariesReady"
        >
          <u-card class="salaries__item" v-for="salary in getSalaries.salaries.filter(item => item.ready)">
            <p class="salaries__track">
              {{ salary.track }}
            </p>
            <p class="salaries__text">
              <b>ФИО: </b> {{ salary.full_name }}
            </p>
            <p class="salaries__text">
              <b>Дата создания заказа: </b> {{ new Date(salary.date).toLocaleDateString('ru-RU') }}
            </p>
          </u-card>
        </u-accordion>
      </u-card>
    </div>

    <u-popup
        v-if="route.name === 'AssemblerSalariesSetting'"
        title="Настройка поиска"
        @close="router.push({name: 'AssemblerSalaries'})"
    >
      <u-form
          text="Найти зарплату"
          @submit.prevent="submitFindSalaries('AssemblerSalaries')"
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