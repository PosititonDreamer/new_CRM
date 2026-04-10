<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import {Chart, Grid, Line, Tooltip} from "vue3-charts";
import {watch} from "vue";
import {Messages} from "@/store/Messages.js";
import {Purchasing} from "@/store/Admin/Purchasing/Purchasing.js";
import {HookPurchasing} from "@/hooks/pages/Purchasing/index.js";
import {ProductsConnection} from "@/store/Admin/Products/Connection.js";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: 'purchasing',
  components: {UCheckbox, Tooltip, Line, Grid, Chart, UCard, UAccordion, UInput, UForm, UPopup, UButton},
  async beforeCreate() {
    const {
      findPurchasingMinDate
    } = Purchasing()
    const {
      findProductsConnections
    } = ProductsConnection()

    await findPurchasingMinDate()
    await findProductsConnections()
  },
  setup() {

    const {
      getPurchasing,
      getMinDate,
      router,
      route,
      date_start,
      date_end,
      period,
      submitFindPurchasing,
      computedPurchasing,
      columnsDays
    } = HookPurchasing()

    const {addMessages} = Messages()

    const changeRoute = (to) => {
      if (to.name === 'purchasing') {
        date_start.value.value = ''
        date_end.value.value = ''

        date_start.value.tacked = false
        date_end.value.tacked = false
      }
    }

    watch(route, () => {
      changeRoute(route.name)
    })

    changeRoute(route.name)

    const copyPurchasing = () => {
      let copyText = 'Продукты\n'

      copyText += 'Название\t' + columnsDays.value.join(' дней\t') + " дней\n"

      computedPurchasing.value.connection.forEach(item => {
        copyText += `${item.title}\t`
        columnsDays.value.forEach(day => {
          copyText += ((day * item.sum_day - item.sum_actual) > 0 ? Math.ceil((day * item.sum_day - item.sum_actual)) : 0) + "\t"
        })
        copyText += '\n'
      })

      computedPurchasing.value.products.forEach(item => {
        copyText += `${item.title}\t`
        columnsDays.value.forEach(day => {
          copyText += ((day * item.sum_day - item.actual) > 0 ? Math.ceil((day * item.sum_day - item.actual)) : 0) + "\t"
        })
        copyText += '\n'
      })

      copyText += '\n'
      copyText += 'Расходники\n'
      copyText += 'Название\t' + columnsDays.value.join(' дней\t') + " дней\n"
      computedPurchasing.value.consumable.forEach(item => {
        copyText += `${item.title}\t`
        columnsDays.value.forEach(day => {
          copyText += ((day * item.sum_day - item.actual) > 0 ? Math.ceil((day * item.sum_day - item.actual)) : 0) + "\t"
        })
        copyText += '\n'
      })

      copyText += '\n'
      copyText += 'Коробки и магниты\n'
      copyText += 'Название\t' + columnsDays.value.join(' дней\t') + " дней\n"
      computedPurchasing.value.other.forEach(item => {
        copyText += `${item.title}\t`
        columnsDays.value.forEach(day => {
          copyText += ((day * item.sum_day - item.actual) > 0 ? Math.ceil((day * item.sum_day - item.actual)) : 0) + "\t"
        })
        copyText += '\n'
      })

      navigator.clipboard.writeText(copyText)
      addMessages(['Таблица успешно скопирована'], 'success')
    }

    const copyPurchasingSelect = () => {let copyText = 'Продукты\n'

      copyText += 'Название\t' + "Количество\n"

      computedPurchasing.value.connection.filter(item => !!item.copy).forEach(item => {
        copyText += `${item.title}\t`
        copyText += ((item.copy * item.sum_day - item.sum_actual) > 0 ? Math.ceil((item.copy * item.sum_day - item.sum_actual)) : 0) + "\t"
        copyText += '\n'
      })

      computedPurchasing.value.products.filter(item => !!item.copy).forEach(item => {
        copyText += `${item.title}\t`
        copyText += ((item.copy * item.sum_day - item.actual) > 0 ? Math.ceil((item.copy * item.sum_day - item.actual)) : 0) + "\t"
        copyText += '\n'
      })

      copyText += '\n'
      copyText += 'Расходники\n'
      copyText += 'Название\t' + "Количество\n"
      computedPurchasing.value.consumable.filter(item => !!item.copy).forEach(item => {
        copyText += `${item.title}\t`
        copyText += ((item.copy * item.sum_day - item.actual) > 0 ? Math.ceil((item.copy * item.sum_day - item.actual)) : 0) + "\t"
        copyText += '\n'
      })

      copyText += '\n'
      copyText += 'Коробки и магниты\n'
      copyText += 'Название\t' + "Количество\n"
      computedPurchasing.value.other.filter(item => !!item.copy).forEach(item => {
        copyText += `${item.title}\t`
        copyText += ((item.copy * item.sum_day - item.actual) > 0 ? Math.ceil((item.copy * item.sum_day - item.actual)) : 0) + "\t"
        copyText += '\n'
      })

      navigator.clipboard.writeText(copyText)
      addMessages(['Выбранные данные успешно скопированы'], 'success')
    }

    const copyPurchasingPeriod = (period, table) => {
      let copyText = ''

      const tables = {
        'connection': 'Продукты',
        'products': 'Продукты',
        'consumable': 'Расходники',
        'other': 'Коробки и магниты',
      }

      copyText += tables[table] + "\n"

      copyText += 'Название\t' + period + " дней\n"

      if(table === 'connection') {
        computedPurchasing.value.connection.forEach(item => {
          copyText += `${item.title}\t`
          copyText += ((period * item.sum_day - item.sum_actual) > 0 ? Math.ceil((period * item.sum_day - item.sum_actual)) : 0) + "\t"
          copyText += '\n'
        })
      } else {
        computedPurchasing.value[table].forEach(item => {
          copyText += `${item.title}\t`
          copyText += ((period * item.sum_day - item.actual) > 0 ? Math.ceil((period * item.sum_day - item.actual)) : 0) + "\t"
          copyText += '\n'
        })
      }

      navigator.clipboard.writeText(copyText)
      addMessages(['Выбранный период у таблицы успешно скопирован'], 'success')
    }

    return {
      getPurchasing,
      getMinDate,
      router,
      route,
      date_start,
      date_end,
      period,
      submitFindPurchasing,
      copyPurchasing,
      copyPurchasingSelect,
      computedPurchasing,
      columnsDays,
      copyPurchasingPeriod
    }
  }
}
</script>

<template>
  <div class="purchasing">
    <div class="purchasing__actions">
      <u-button
          @click="router.push({name: 'PurchasingSetting'})"
      >
        Настройки закупку
      </u-button>
      <u-button
          v-if="getPurchasing"
          @click="copyPurchasing"
      >
        Скопировать данные
      </u-button>
      <u-button
          v-if="getPurchasing"
          @click="copyPurchasingSelect"
      >
        Скопировать выбранные данные
      </u-button>
    </div>
    <div class="purchasing__wrapper" v-if="getPurchasing">
      <p class="purchasing__sub-title">Расчет расходов с {{getPurchasing.date_start.split('-').reverse().join('.')}} до {{getPurchasing.date_end.split('-').reverse().join('.')}}</p>
      <p class="purchasing__sub-title">{{ getPurchasing.days }} дней</p>
      <div class="list" :style="`--columns: ${columnsDays.length}`">
        <p class="purchasing__title">Связи продуктов</p>
        <div class="purchasing__list">
          <div class="purchasing__row purchasing__row--composite purchasing__row--title">
            <div class="purchasing__item">
              Название
            </div>
            <div class="purchasing__item">
              Продукт
            </div>
            <div class="purchasing__item">
              Расход
            </div>
            <div class="purchasing__item purchasing__item--period"  @click="copyPurchasingPeriod(day, 'connection')" v-for="day in columnsDays">
              {{ day }} дней
            </div>
          </div>
          <div class="purchasing__row purchasing__row--composite" v-for="item in computedPurchasing.connection">
            <div class="purchasing__item " >
              {{ item.title }}
            </div>
            <div class="purchasing__child-row">
              <template v-for="product in item.list">
                <div class="purchasing__item">
                  {{ product.title }}
                </div>
                <div class="purchasing__item">
                  <UCheckbox
                      title=""
                      name="checkbox"
                      value=""
                      :checked="product.active"
                      @checked="() => {
                  product.active = !product.active
                  item.update_sum_expense()
                }"
                  />
                </div>
                <div class="purchasing__item">
                  {{ product.sum_day }} ({{product.percent}}%)
                </div>
              </template>
            </div>
            <div @click="() => item.copy = day" :class="['purchasing__item purchasing__item--label  ', {'purchasing__item--active': item.copy === day}]" v-for="day in columnsDays" >
              {{ (day * item.sum_day - item.sum_actual) > 0 ? Math.ceil((day * item.sum_day - item.sum_actual)) : 0 }}
            </div>
          </div>
        </div>
        <p class="purchasing__title">Продукты</p>
        <div class="purchasing__list">
          <div class="purchasing__row purchasing__row--title">
            <div class="purchasing__item">
              Название
            </div>
            <div class="purchasing__item">
              Расход
            </div>
            <div class="purchasing__item purchasing__item--period" @click="copyPurchasingPeriod(day, 'products')" v-for="day in columnsDays">
              {{ day }} дней
            </div>
          </div>
          <div class="purchasing__row" v-for="item in computedPurchasing.products">
            <div class="purchasing__item " >
              {{ item.title }}
            </div>
            <div class="purchasing__item purchasing__item--label" >
              {{ item.sum_day }}
            </div>
            <div @click="() => item.copy = day" :class="['purchasing__item purchasing__item--label  ', {'purchasing__item--active': item.copy === day}]" v-for="day in columnsDays" >
              {{ (day * item.sum_day - item.actual) > 0 ? Math.ceil((day * item.sum_day - item.actual)) : 0 }}
            </div>
          </div>
        </div>
        <p class="purchasing__title">Расходники</p>
        <div class="purchasing__list">
          <div class="purchasing__row purchasing__row--title">
            <div class="purchasing__item">
              Название
            </div>
            <div class="purchasing__item">
              Расход
            </div>
            <div class="purchasing__item purchasing__item--period" @click="copyPurchasingPeriod(day, 'consumable')" v-for="day in columnsDays">
              {{ day }} дней
            </div>
          </div>
          <div class="purchasing__row" v-for="item in computedPurchasing.consumable">
            <div class="purchasing__item " >
              {{ item.title }}
            </div>
            <div class="purchasing__item purchasing__item--label" >
              {{ item.sum_day }}
            </div>
            <div @click="() => item.copy = day" :class="['purchasing__item purchasing__item--label  ', {'purchasing__item--active': item.copy === day}]" v-for="day in columnsDays" >
              {{ (day * item.sum_day - item.actual) > 0 ? Math.ceil((day * item.sum_day - item.actual)) : 0 }}
            </div>
          </div>
        </div>
        <p class="purchasing__title">Коробки и магниты</p>
        <div class="purchasing__list">
          <div class="purchasing__row purchasing__row--title">
            <div class="purchasing__item">
              Название
            </div>
            <div class="purchasing__item">
              Расход
            </div>
            <div class="purchasing__item purchasing__item--period" @click="copyPurchasingPeriod(day, 'other')" v-for="day in columnsDays">
              {{ day }} дней
            </div>
          </div>
          <div class="purchasing__row" v-for="item in computedPurchasing.other">
            <div class="purchasing__item " >
              {{ item.title }}
            </div>
            <div class="purchasing__item purchasing__item--label" >
              {{ item.sum_day }}
            </div>
            <div @click="() => item.copy = day" :class="['purchasing__item purchasing__item--label  ', {'purchasing__item--active': item.copy === day}]" v-for="day in columnsDays" >
              {{ (day * item.sum_day - item.actual) > 0 ? Math.ceil((day * item.sum_day - item.actual)) : 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <u-popup
        v-if="route.name === 'PurchasingSetting'"
        title="Найти графики"
        @close="router.push({name: 'Purchasing'})"
    >
      <u-form
          text="Настроить закупку"
          @submit.prevent="submitFindPurchasing"
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

<style lang="scss" src="./Purchasing.scss" scoped/>