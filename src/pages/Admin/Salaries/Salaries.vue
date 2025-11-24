<script>
import {Workers} from "@/store/Admin/Workers/Workers.js";
import {HookSalaries} from "@/hooks/pages/Salaries/index.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import {computed, watch} from "vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: 'Salaries',
  components: {UCheckbox, UCard, UAccordion, UForm, USelect, UInput, UPopup, UButton},
  async beforeCreate() {
    const {findWorkers} = Workers()

    await findWorkers()
  },
  setup() {
    const {
      getSalaries,
      route,
      router,
      salaryAssembler,
      salaryOperator,
      submitFindSalaries,
      submitAcceptSalariesOperator,
      submitAcceptSalariesAssembler,
      worker,
      date_start,
      date_end,
      clearData
    } = HookSalaries()

    const {getWorkers} = Workers()

    const computedWorkers = computed(() => {
      return getWorkers.value.map(item => {
        return {
          value: item.id,
          name: item.name
        }
      })
    })

    const computedSalaryWorker = computed(() => {
      const findWorker = getWorkers.value.find(item => +item.id === +getSalaries.value?.worker)
      return findWorker ? findWorker.salary : 0
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

    const computedSalariesOperator = computed(() => {
      return {
        salaries: getSalaries.value.salaries.reduce((sum, item) => sum + +item.sum, 0),
        penalties: getSalaries.value.penalties.filter(item => item.ready).reduce((sum, item) => sum + +item.sum, 0)
      }
    })

    const computedCurrentSalaries = computed(() => {
      const salaries = getSalaries.value.salaries.filter(item => salaryAssembler.salariesList.value.find(salary => +salary === +item.id))
      const penalties = getSalaries.value.penalties.filter(item => salaryAssembler.penaltiesList.value.find(penalty => +penalty === +item.id))

      return {
        salaries: computedSalaryWorker.value * salaries.length,
        penalties: penalties.reduce((sum, item) => sum + +item.sum, 0)
      }
    })

    const computedCurrentSalariesOperator = computed(() => {
      const penalties = getSalaries.value.penalties.filter(item => salaryAssembler.penaltiesList.value.find(penalty => +penalty === +item.id))

      return penalties.reduce((sum, item) => sum + +item.sum, 0)
    })

    const changeRoute = (to) => {
      if(to.name === 'Salaries') {
        clearData()
      }

      if(to.name === 'SalariesAccept' && !getSalaries.value) {
        router.push({name: 'Salaries'})
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      getSalaries,
      getWorkers,
      route,
      router,
      salaryAssembler,
      salaryOperator,
      submitFindSalaries,
      submitAcceptSalariesOperator,
      submitAcceptSalariesAssembler,
      worker,
      date_start,
      date_end,
      computedWorkers,
      computedSalaryWorker,
      computedPaySalaryWorker,
      computedNotPaySalaryWorker,
      computedSalariesOperator,
      computedCurrentSalaries,
      computedCurrentSalariesOperator
    }
  }
}
</script>

<template>
  <div class="salaries">
    <div class="salaries__actions">
      <u-button
          class="salaries__create"
          @click="router.push({name: 'SalariesSetting'})"
      >
        Настройки зарплаты
      </u-button>

      <u-button
          class="salaries__create"
          @click="router.push({name: 'SalariesAccept'})"
          v-if="getSalaries"
      >
        Выдать зарплату
      </u-button>
    </div>
    <div class="salaries__list" v-if="getSalaries && +getSalaries?.rule === 2">
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
    <div class="salaries__list" v-if="getSalaries && +getSalaries?.rule === 3">
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
        v-if="route.name === 'SalariesSetting' && computedWorkers.length"
        title="Настройка поиска"
        @close="router.push({name: 'Salaries'})"
    >
      <u-form
          text="Найти зарплату"
          @submit.prevent="submitFindSalaries()"
      >
        <u-select
            title="Работник"
            :values="computedWorkers"
            v-model="worker.value"
            :start-value="worker.value"
            :error="worker.error"
            @change="worker.tacked = true"

        />
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
    <u-popup
        title="Выдача зарплаты"
        v-if="route.name === 'SalariesAccept' && getSalaries"
        @close="router.push({name: 'Salaries'})"
    >
      <u-form
          v-if="+getSalaries.rule === 2"
          text="Выдать зарплату"
          @submit.prevent="submitAcceptSalariesAssembler()"
      >
        <u-card class="salaries__card salaries__card--sticky">
          <p class="salaries__sub-title">
            К оплате: {{computedCurrentSalaries.salaries - computedCurrentSalaries.penalties}} ₽
          </p>
          <p class="salaries__text">
            <b>Заказов: </b> {{salaryAssembler.salariesList.value.length}}
          </p>
          <p class="salaries__text">
            <b>Стоимость одного заказа: </b> {{computedSalaryWorker}} ₽
          </p>
          <p class="salaries__text">
            <b>Сумма оплаты за заказы: </b> {{computedCurrentSalaries.salaries}} ₽
          </p>
          <p class="salaries__text">
            <b>Штрафов: </b> {{salaryAssembler.penaltiesList.value.length}}
          </p>
          <p class="salaries__text">
            <b>Сумма штрафов: </b> {{computedCurrentSalaries.penalties}} ₽
          </p>
        </u-card>
        <u-card
            v-if="getSalaries.penalties.filter(item => !item.ready).length"
        >
          <p class="salaries__sub-title">
            Штрафы:
          </p>
          <u-checkbox
              class="salaries__checkbox"
              title="Выбрать все штрафы"
              name="penalty"
              value="all"
              :checked="salaryAssembler.penaltiesList.value.length === getSalaries.penalties.filter(item => !item.ready).length"
              @checked="e => salaryAssembler.penaltiesList.value = e.checked ? getSalaries.penalties.filter(item => !item.ready).map(item => item.id) : []"
          />
          <u-card class="salaries__item" v-for="penalty in getSalaries.penalties.filter(item => !item.ready)">
            <u-checkbox
                :title="`${penalty.sum} ${penalty.description}`"
                name="penalty"
                :value="penalty.id"
                :checked="!!salaryAssembler.penaltiesList.value.find(item => +item === +penalty.id)"
                @checked="salaryAssembler.penaltiesList.value.find(item => +item === +penalty.id) ? salaryAssembler.penaltiesList.value =salaryAssembler.penaltiesList.value.filter(item => +item !== +penalty.id) : salaryAssembler.penaltiesList.value.push(penalty.id)"
            />
          </u-card>
        </u-card>
        <u-card class="salaries__card">
          <p class="salaries__sub-title">
            Заказы:
          </p>
          <u-checkbox
              class="salaries__checkbox"
              title="Выбрать все заказы"
              name="salary"
              value="all"
              :checked="salaryAssembler.salariesList.value.length === getSalaries.salaries.filter(item => !item.ready && item.send).length"
              @checked="e => salaryAssembler.salariesList.value = e.checked ? getSalaries.salaries.filter(item => !item.ready && item.send).map(item => item.id) : []"
          />

          <u-card class="salaries__item"
                  v-for="salary in getSalaries.salaries.filter(item => !item.ready && item.send)">
            <u-checkbox
                :title="`${salary.track} ${salary.full_name}`"
                name="salary"
                :value="salary.id"
                :checked="!!salaryAssembler.salariesList.value.find(item => +item === +salary.id)"
                @checked="salaryAssembler.salariesList.value.find(item => +item === +salary.id) ? salaryAssembler.salariesList.value = salaryAssembler.salariesList.value.filter(item => +item !== +salary.id) : salaryAssembler.salariesList.value.push(salary.id)"
            />
          </u-card>
        </u-card>
      </u-form>
      <u-form
          v-if="+getSalaries.rule === 3"
          text="Выдать зарплату"
          @submit.prevent="submitAcceptSalariesOperator()"
      >
        <u-card class="salaries__card salaries__card--sticky">
          <p class="salaries__sub-title">
            К оплате: {{salaryOperator.sum.value.value - computedCurrentSalariesOperator}} ₽
          </p>
          <p class="salaries__text">
            <b>Штрафов: </b> {{salaryOperator.penaltiesList.value.length}}
          </p>
          <p class="salaries__text">
            <b>Сумма штрафов: </b> {{computedCurrentSalariesOperator}} ₽
          </p>
        </u-card>
        <u-input
            title="Минимальная дата"
            type="date"
            :min="getSalaries.salaries.length ? new Date(getSalaries.salaries[0].date_end).toISOString().split('T')[0] : ''"
            :max="new Date().toISOString().split('T')[0]"
            :start-value="salaryOperator.dateStart.value.value"
            v-model="salaryOperator.dateStart.value.value"
            :error="salaryOperator.dateStart.value.error"
            @change="salaryOperator.dateStart.value.tacked = true"
        />
        <u-input
            title="Максимальная дата"
            type="date"
            :min="salaryOperator.dateStart.value.value ? salaryOperator.dateStart.value.value : getSalaries.salaries.length ? new Date(getSalaries.salaries[0].date_end).toISOString().split('T')[0] : ''"
            :start-value="salaryOperator.dateEnd.value.value"
            v-model="salaryOperator.dateEnd.value.value"
            :error="salaryOperator.dateEnd.value.error"
            @change="salaryOperator.dateEnd.value.tacked = true"
        />
        <u-input
            title="Сумма"
            type="number"
            :error="salaryOperator.sum.value.error"
            :start-value="salaryOperator.sum.value.value"
            v-model="salaryOperator.sum.value.value"
            @change="salaryOperator.sum.value.tacked = true"
        />
        <u-input
            title="Описание"
            type="textarea"
            :error="salaryOperator.description.value.error"
            :start-value="salaryOperator.description.value.value"
            v-model="salaryOperator.description.value.value"
            @change="salaryOperator.description.value.tacked = true"
        />
        <u-card
            v-if="getSalaries.penalties.filter(item => !item.ready).length"
        >
          <p class="salaries__sub-title">
            Штрафы:
          </p>
          <u-checkbox
              class="salaries__checkbox"
              title="Выбрать все штрафы"
              name="penalty"
              value="all"
              :checked="salaryAssembler.penaltiesList.value.length === getSalaries.penalties.filter(item => !item.ready).length"
              @checked="e => salaryAssembler.penaltiesList.value = e.checked ? getSalaries.penalties.filter(item => !item.ready).map(item => item.id) : []"
          />
          <u-card class="salaries__item" v-for="penalty in getSalaries.penalties.filter(item => !item.ready)">
            <u-checkbox
                :title="`${penalty.sum} ${penalty.description}`"
                name="penalty"
                :value="penalty.id"
                :checked="!!salaryAssembler.penaltiesList.value.find(item => +item === +penalty.id)"
                @checked="salaryAssembler.penaltiesList.value.find(item => +item === +penalty.id) ? salaryAssembler.penaltiesList.value =salaryAssembler.penaltiesList.value.filter(item => +item !== +penalty.id) : salaryAssembler.penaltiesList.value.push(penalty.id)"
            />
          </u-card>
        </u-card>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Salaries.scss" scoped/>