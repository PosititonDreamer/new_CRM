<script>

import {Goods} from "@/store/Admin/Goods/Goods.js";
import {HookGoods} from "@/hooks/pages/Goods/index.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";

export default {
  name: "Goods",
  components: {UInput, USelect, UForm, UPopup, UAlert, UActions, UCard, UAccordion, UButton},
  async beforeCreate() {
    const {findGoods} = Goods()
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()
    await findGoods()
    await findProducts()
    await findMeasureUnits()
  },
  setup() {
    const {
      route,
      router,
      good,
      getGoods,
      submitCreateGoods,
      submitUpdateGoods,
      submitUpdateBalanceGoods,
      submitDeleteGoods,
      viewPrice
    } = HookGoods()

    const {findGoods} = Goods()
    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()

    watch(() => route.params.warehouse,
        () => {
          findGoods()
        }
    )

    const computedProducts = computed(() => {
      return getProducts.value.filter(product => !!getGoods.value.find(item => item.product === product.id))
    })

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "updateBalance",
        text: "Изменить баланс",
      },
      {
        name: "delete",
        text: "Удалить"
      },
    ])

    const products = computed(() => {
      return getProducts.value.map(product => {
        return {
          name: product.show_title ? product.show_title : product.title,
          value: product.id
        }
      })
    })

    const changeRoute = (to) => {
      if (to.name === "Goods") {
        good.quantity.value.value = 0
        good.balance.value.value = 0
        good.few.value.value = 0
        good.few_very.value.value = 0
        good.product.value.value = ''
        good.article.value.value = ''

        good.quantity.value.tacked = false
        good.product.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }
      if ((to.name === 'GoodsUpdate' && to.params.id) || (to.name === 'GoodsUpdateBalance' && to.params.id)) {
        if (!getProducts.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findGood = getGoods.value.find((item) => item.id === to.params.id)

        good.quantity.value.value = +findGood.quantity
        good.balance.value.value = +findGood.balance
        good.few.value.value = +findGood.few
        good.few_very.value.value = +findGood.few_very
        good.product.value.value = findGood.product
        good.article.value.value = findGood.article
        good.price.value.value = findGood.price

        good.quantity.value.tacked = true
        good.product.value.tacked = true

      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      route,
      router,
      good,
      getGoods,
      getProducts,
      getMeasureUnits,
      submitCreateGoods,
      submitUpdateGoods,
      submitUpdateBalanceGoods,
      submitDeleteGoods,
      computedProducts,
      actions,
      products,
      viewPrice
    }
  }
}
</script>

<template>
  <div class="goods">
    <u-button class="goods__create"
              @click="router.push({name: 'GoodsCreate', params: { warehouse: route.params.warehouse }})">
      Добавить фасованный товар
    </u-button>
    <div class="goods__list">
      <div
          :class="['goods__item', {'goods__item--commodity': viewPrice}]"
          v-for="(product, id) in computedProducts"
          :key="`goods-item-product${product.id}`"
          :style="[{'--z-index': computedProducts.length - id}]"
      >
        <p
            class="text text--bold goods__product-title"
            :style="[{'--rows': getGoods.filter(item => item.product === product.id).length}]"
        >{{ product.show_title ? product.show_title : product.title }}</p>
        <template
            v-for="(good, id) in getGoods.filter(item => item.product === product.id).sort((itemA, itemB) => itemA.quantity - itemB.quantity)"
            class="goods__item"
            :key="`good-item-${good.id}`"
        >
          <p class="text">
            {{ good.article }}
          </p>
          <p class="text">
            {{ good.quantity }}
            {{ getMeasureUnits.find(measure => measure.id === product.measure_unit)?.title }}
          </p>

          <p v-if="!good.weight"
             :class="['text', {'text--bold text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'text--bold text--few-very': +good.balance <= +good.few_very}, {'text--bold text--null': +good.balance === 0}]">
            {{ good.balance }}
          </p>
          <p v-else class="text">
            <b>Весовой товар</b>
          </p>
          <p class="text">
            {{ +good.price > 0 ? `${good.price}₽` : '' }}
          </p>
          <u-actions
              :style="[{'--z-index': getGoods.filter(item => item.product === product.id).length - id}]"
              class="goods__actions"
              :actions="actions"
              @update="router.push({name: 'GoodsUpdate', params: {id: good.id}})"
              @updateBalance="router.push({name: 'GoodsUpdateBalance', params: {id: good.id}})"
              @delete="router.push({name: 'GoodsDelete', params: {id: good.id}})"
          />
        </template>
      </div>
    </div>
    <div class="list goods__list goods__list--mobile">
      <u-card class="goods__item" v-for="product in computedProducts" :key="`goods-item-mobile-product${product.id}`">
        <u-accordion
            :title="product.show_title ? product.show_title : product.title"
        >
          <div class="list">
            <u-card
                v-for="(good, id) in getGoods.filter(item => item.product === product.id)"
                :style="[{'--z-index': getGoods.filter(item => item.product === product.id).length - id}]"
                class="goods__item"
                :key="`good-item-${good.id}`"
            >
              <u-actions
                  class="goods__actions"
                  :actions="actions"
                  @update="router.push({name: 'GoodsUpdate', params: {id: good.id}})"
                  @updateBalance="router.push({name: 'GoodsUpdateBalance', params: {id: good.id}})"
                  @delete="router.push({name: 'GoodsDelete', params: {id: good.id}})"
              />
              <p class="text">
                <b>Упаковка: </b> {{ good.quantity }}
                {{ getMeasureUnits.find(measure => measure.id === product.measure_unit)?.title }}
              </p>
              <p class="text">
                <b>Артикул: </b> {{ good.article }}
              </p>
              <p v-if="!good.weight"
                 :class="['text', {'text--bold text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'text--bold text--few-very': +good.balance <= +good.few_very}, {'text--bold text--null': +good.balance === 0}]">
                <b>Остаток: </b> {{ good.balance }}
                <span v-if="+good.balance === 0">не осталось товара</span>
                <span v-else-if="+good.balance <= +good.few && +good.balance > +good.few_very">мало товара</span>
                <span v-else-if="+good.balance <= +good.few_very">очень мало товара</span>
              </p>
              <p v-else class="text">
                <b>Весовой товар</b>
              </p>
              <p class="text" v-if="+good.price > 0">
                <b>Оплата сборщику: </b> {{ good.price }} ₽
              </p>
            </u-card>
          </div>
        </u-accordion>
      </u-card>
    </div>

    <u-alert
        v-if="route.name === 'GoodsDelete' && route.params.id"
        title="Удалить фасованный товар?"
        type="confirm"
        @close="router.push({name: 'Goods', params: {warehouse: route.params.warehouse}})"
        @accept="submitDeleteGoods"
    />

    <u-popup
        v-if="route.name === 'GoodsCreate' && getProducts.length && getMeasureUnits.length"
        title="Добавление фасованного товара"
        @close="router.push({name: 'Goods', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          text="Добавить фасованный товар"
          @submit.prevent="submitCreateGoods"
      >
        <div class="list">

          <u-select
              title="Продукт"
              :values="products"
              :start-value="good.product.value.value"
              :error="good.product.value.error"
              v-model="good.product.value.value"
              @change="good.product.value.tacked = true"
          />
          <u-input
              :title="`Количество ${getMeasureUnits.find(measure => measure.id === good.product.value.value)?.title ?? ''} в упаковке`"
              type="number"
              :start-value="good.quantity.value.value"
              :error="good.quantity.value.error"
              v-model="good.quantity.value.value"
              @change="good.quantity.value.tacked = true"
              @blur="good.quantity.value.tacked = true"
          />
          <u-input
              title="Остаток"
              type="number"
              :start-value="good.balance.value.value"
              v-model="good.balance.value.value"
          />
          <u-input
              title="Артикул"
              :start-value="good.article.value.value"
              v-model="good.article.value.value"
          />
          <u-input
              title="Малое количество товара"
              type="number"
              :start-value="good.few.value.value"
              v-model="good.few.value.value"
          />
          <u-input
              title="Очень малое количество товара"
              type="number"
              :start-value="good.few_very.value.value"
              v-model="good.few_very.value.value"
          />
          <u-input
              v-if="viewPrice"
              title="Оплата сборщику за единицу товара"
              type="number"
              :start-value="good.price.value.value"
              v-model="good.price.value.value"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
        </div>
      </u-form>
    </u-popup>

    <u-popup
        v-if="(route.name === 'GoodsUpdate' || route.name === 'GoodsUpdateBalance') && getProducts.length && getMeasureUnits.length && getGoods.length"
        :title="`Изменение ${route.name === 'GoodsUpdateBalance' ? 'остатка' : ''} фасованного товара`"
        @close="router.push({name: 'Goods', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          :text="route.name === 'GoodsUpdateBalance' ? 'Изменить остаток фасованного товара' : 'Изменить фасованный товар'"
          @submit.prevent="route.name === 'GoodsUpdateBalance' ? submitUpdateBalanceGoods()  : submitUpdateGoods()"
      >
        <div class="list">
          <u-select
              title="Продукт"
              :values="products"
              :start-value="good.product.value.value"
              :error="good.product.value.error"
              v-model="good.product.value.value"
              @change="good.product.value.tacked = true"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
          <u-input
              :title="`Количество ${getMeasureUnits.find(measure => measure.id === good.product.value.value)?.title ?? ''} в упаковке`"
              type="number"
              :start-value="good.quantity.value.value"
              :error="good.quantity.value.error"
              v-model="good.quantity.value.value"
              @change="good.quantity.value.tacked = true"
              @blur="good.quantity.value.tacked = true"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
          <u-input
              title="Остаток"
              type="number"
              :start-value="good.balance.value.value"
              v-model="good.balance.value.value"
          />
          <u-input
              title="Артикул"
              :start-value="good.article.value.value"
              v-model="good.article.value.value"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
          <u-input
              title="Малое количество товара"
              type="number"
              :start-value="good.few.value.value"
              v-model="good.few.value.value"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
          <u-input
              title="Очень малое количество товара"
              type="number"
              :start-value="good.few_very.value.value"
              v-model="good.few_very.value.value"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
          <u-input
              v-if="viewPrice"
              title="Оплата сборщику за единицу товара"
              type="number"
              :start-value="good.price.value.value"
              v-model="good.price.value.value"
              :disabled="route.name === 'GoodsUpdateBalance'"
          />
        </div>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Goods.scss" scoped/>
