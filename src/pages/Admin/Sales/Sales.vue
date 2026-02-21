<script>
import {SalesHook} from "@/hooks/pages/Sales/index.js";
import {Goods} from "@/store/Admin/Goods/Goods.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {Sales} from "@/store/Admin/Sales/Sales.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";

export default {
  name: "Sales",
  components: {UForm, UCheckbox, USelect, UAlert, UInput, UPopup, UActions, UCard, UAccordion, UButton},
  async beforeCreate() {
    const {findSales} = Sales()
    const {findGoods} = Goods()
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()

    await findSales()
    await findGoods()
    await findProducts()
    await findMeasureUnits()

  },
  setup() {
    const {
      getSales,
      route,
      router,
      sale,
      addItem,
      removeItem,
      submitCreateSales,
      submitUpdateSales,
      submitDeleteSales,
      clearData,
    } = SalesHook()

    const loading = ref(false)

    const {getGoods} = Goods()
    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "delete",
        text: "Удалить"
      },
    ])

    const changeRoute = (to) => {
      if (to.name === "Sales") {
        clearData()

        document.body.removeAttribute("style");
        return;
      }
      if (to.name === 'SalesCreate') {
        addItem()
        return;
      }
      if (to.name === 'SalesUpdate' && to.params.id) {
        loading.value = false
        if (!getSales.value.length || !getGoods.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findSale = getSales.value.find(item => +item.id === +to.params.id)
        sale.title.value.value = findSale.title
        sale.keywords.value.value = findSale.keywords
        sale.sum.value.value = findSale.sum
        sale.sum_max.value.value = findSale.sum_max ?? 0
        sale.date.value.value = findSale.date
        sale.date_start.value.value = findSale.date_start


        findSale.list.forEach(item => {
          const good = getGoods.value.find(good => good.id === item.good)
          addItem({
            quantity: +item.quantity,
            good: item.good,
            product: good.product
          }, item.id)
        })

        sale.title.value.tacked = true
        sale.date.value.tacked = true
        setTimeout(() => {
          loading.value = true
        })
      }
    }

    const computedGoods = computed(() => {
      if (!getGoods.value.length) {
        return []
      }

      return getGoods.value.map(good => {
        good.product_item = getProducts.value.find(item => item.id === good.product)
        good.measure = getMeasureUnits.value.find(item => item.id === good.product_item.measure_unit)

        return {
          name: `${good.quantity} ${good.measure?.title ? good.measure?.title : ''}`,
          value: good.id,
          product: good.product
        }
      })
    })

    const computedProducts = computed(() => {
      if (!getProducts.value.length) {
        return []
      }

      return getProducts.value.map(product => {
        return {
          name: product.show_title ? product.show_title : product.title,
          value: product.id
        }
      })
    })

    const computedSales = computed(() => {
      if (!getSales.value.length || !getGoods.value.length || !getProducts.value.length || !getMeasureUnits.value.length) {
        return []
      }
      return getSales.value.map(sale => {
        sale.list = sale.list.map(item => {
          const findGood = getGoods.value.find(good => good.id === item.good)
          const findProduct = getProducts.value.find(product => product.id === findGood.product)
          const MeasureUnits = getMeasureUnits.value.find(unit => unit.id === findProduct.measure_unit)
          item.title = `${findProduct?.show_title ? findProduct.show_title : findProduct.title}, ${findGood.quantity} ${MeasureUnits?.title ? MeasureUnits?.title : ''}`
          return item
        })
        return sale
      })
    })

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      route,
      router,
      sale,
      addItem,
      removeItem,
      submitCreateSales,
      submitUpdateSales,
      submitDeleteSales,
      actions,
      computedGoods,
      computedProducts,
      computedSales,
      loading
    }
  }
}
</script>
<template>
  <div class="sales">
    <u-button
        @click="router.push({name: 'SalesCreate', params: {warehouse: route.params.warehouse}})"
        class="sales__create"
    >
      Добавить акцию
    </u-button>
    <div class="list sales__list">
      <u-card
          v-for="(sale, id) in computedSales"
          class="sales__item"
          :key="`sale-${sale.id}`"
          :style="[{'--z-index': computedSales.length - id}]"
      >
        <p class="sub-title">{{ sale.title }}</p>
        <p class="text" v-if="sale.keywords.trim().length">
          <b>Ключевые слова: </b> {{sale.keywords}}
        </p>
        <p class="text" v-else>
          <i>
            <b>Без ключевых слов</b>
          </i>
        </p>
        <p class="text">
          <b>Сумма: </b> От {{sale.sum}} ₽ <template v-if="sale.sum_max">до {{sale.sum_max}} ₽ </template>
        </p>
        <p class="text">
          <b>Активна с: </b> {{new Date(sale.date_start).toLocaleDateString('ru-RU')}}
        </p>
        <p class="text">
          <b>Активна до: </b> {{new Date(sale.date).toLocaleDateString('ru-RU')}}
        </p>
        <u-actions
            class="sales__actions"
            :actions="actions"
            @update="router.push({name: 'SalesUpdate', params: {id: sale.id}})"
            @delete="router.push({name: 'SalesDelete', params: {id: sale.id}})"
        />
        <u-accordion
            class="sales__accordion"
            title="Входящие фасованные товары"
            small
        >
          <div class="sales__content">
            <p
                v-for="item in sale.list"
                class="text"
                :key="`sale-text-item-${item.id}`"
            >
              {{ item.title }}, {{ item.quantity }} шт.
            </p>
          </div>
        </u-accordion>
      </u-card>
    </div>
    <u-alert
        v-if="route.name === 'SalesDelete' && route.params.id"
        title="Удалить акцию?"
        type="confirm"
        @close="router.push({name: 'Sales'})"
        @accept="submitDeleteSales"
    />
    <u-popup
        v-if="route.name === 'SalesCreate' && computedGoods.length && computedProducts.length"
        title="Добавление акции"
        @close="router.push({name: 'Sales'})"
    >
      <u-form
          text="Добавить акцию"
          @submit.prevent="submitCreateSales"
      >
        <div class="list">
          <u-input
              title="Название"
              :start-value="sale.title.value.value"
              :error="sale.title.value.error"
              v-model="sale.title.value.value"
              @change="sale.title.value.tacked = true"
              @blur="sale.title.value.tacked = true"
          />
          <u-input
              title="Ключевые слова"
              :start-value="sale.keywords.value.value"
              v-model="sale.keywords.value.value"
          />
          <u-input
              title="Сумма"
              type="number"
              :start-value="sale.sum.value.value"
              v-model="sale.sum.value.value"
          />
          <u-input
              title="Максимальная сумма"
              :min="0"
              type="number"
              :start-value="sale.sum_max.value.value"
              v-model="sale.sum_max.value.value"
              :error="(sale.sum_max.value.value < sale.sum.value.value && sale.sum_max.value.value !== 0) ? 'Максимальная сумма, должна быть больше минимальной' : ''"
          />
          <u-input
              title="Активна c"
              type="date"
              :max="sale.date.value.value ?? ''"
              :start-value="sale.date_start.value.value"
              v-model="sale.date_start.value.value"
          />
          <u-input
              title="Активна до"
              type="date"
              :min="sale.date_start.value.value ?? new Date().toISOString().split('T')[0]"
              :start-value="sale.date.value.value"
              :error="sale.date.value.error"
              v-model="sale.date.value.value"
              @change="sale.date.value.tacked = true"
              @blur="sale.date.value.tacked = true"
          />
          <u-card>
            <p class="sub-title">Фасованные товары</p>
            <div class="list">

              <u-card
                  v-for="(item, id) in sale.list.value"
                  :key="`sale-item${item.id}`"
                  :class="['list sales__form-item', {'sales__form-item--division': sale.list.value.length > 1}]"
                  :style="[{'--z-index': sale.list.value.length - id}]"
              >
                <u-select
                    title="Продукт"
                    :values="computedProducts"
                    :start-value="item.product.value"
                    :error="item.product.error"
                    v-model="item.product.value"
                    @change="() => {
                  item.product.tacked = true
                  item.good.value = ''
                }"
                    class="sales__select sales__select--product"
                />
                <u-select
                    v-if="item.product.value"
                    title="Товар"
                    :values="computedGoods.filter(good =>  good.product === item.product.value)"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
                />
                <u-input
                    title="Количество"
                    type="number"
                    :start-value="item.quantity.value"
                    :error="item.quantity.error"
                    v-model="item.quantity.value"
                    @change="item.quantity.tacked = true"
                    @blur="item.quantity.tacked = true"
                />
                <u-button
                    v-if="sale.list.value.length > 1"
                    type="button"
                    modifier="red"
                    class="sales__delete-kit"
                    @click="removeItem(item.id)"
                />
              </u-card>
              <u-button
                  type="button"
                  @click="addItem()"
                  class="sales__add-kit"
              >
                Добавить товар
              </u-button>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'SalesUpdate' && loading"
        title="Изменение акции"
        @close="router.push({name: 'Sales'})"
    >
      <u-form
          text="Изменить акцию"
          @submit.prevent="submitUpdateSales"
      >
        <div class="list">
          <u-input
              title="Название"
              :start-value="sale.title.value.value"
              :error="sale.title.value.error"
              v-model="sale.title.value.value"
              @change="sale.title.value.tacked = true"
              @blur="sale.title.value.tacked = true"
          />
          <u-input
              title="Ключевые слова"
              :start-value="sale.keywords.value.value"
              v-model="sale.keywords.value.value"
          />
          <u-input
              title="Сумма"
              type="number"
              :start-value="sale.sum.value.value"
              v-model="sale.sum.value.value"
          />
          <u-input
              title="Максимальная сумма"
              type="number"
              :start-value="sale.sum_max.value.value"
              v-model="sale.sum_max.value.value"
              :error="(sale.sum_max.value.value < sale.sum.value.value && sale.sum_max.value.value !== 0) ? 'Максимальная сумма, должна быть больше минимальной' : ''"
          />
          <u-input
              title="Активна c"
              type="date"
              :max="sale.date.value.value ?? ''"
              :start-value="sale.date_start.value.value"
              v-model="sale.date_start.value.value"
          />
          <u-input
              title="Активна до"
              type="date"
              :min="sale.date_start.value.value ?? new Date().toISOString().split('T')[0]"
              :start-value="sale.date.value.value"
              :error="sale.date.value.error"
              v-model="sale.date.value.value"
              @change="sale.date.value.tacked = true"
              @blur="sale.date.value.tacked = true"
          />
          <u-card>
            <p class="sub-title">Фасованные товары</p>
            <div class="list">

              <u-card
                  v-for="(item, id) in sale.list.value"
                  :key="`sale-item${item.id}`"
                  :class="['list sales__form-item', {'sales__form-item--division': sale.list.value.length > 1}]"
                  :style="[{'--z-index': sale.list.value.length - id}]"
              >
                <u-select
                    title="Продукт"
                    :values="computedProducts"
                    :start-value="item.product.value"
                    :error="item.product.error"
                    v-model="item.product.value"
                    @change="() => {
                  item.product.tacked = true
                  item.good.value = ''
                }"
                    class="sales__select sales__select--product"
                />
                <u-select
                    v-if="item.product.value"
                    title="Товар"
                    :values="computedGoods.filter(good =>  good.product === item.product.value)"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
                />
                <u-input
                    title="Количество"
                    type="number"
                    :start-value="item.quantity.value"
                    :error="item.quantity.error"
                    v-model="item.quantity.value"
                    @change="item.quantity.tacked = true"
                    @blur="item.quantity.tacked = true"
                />
                <u-button
                    v-if="sale.list.value.length > 1"
                    type="button"
                    modifier="red"
                    class="sales__delete-kit"
                    @click="removeItem(item.id)"
                />
              </u-card>
              <u-button
                  type="button"
                  @click="addItem()"
                  class="sales__add-kit"
              >
                Добавить товар
              </u-button>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./Sales.scss" scoped />