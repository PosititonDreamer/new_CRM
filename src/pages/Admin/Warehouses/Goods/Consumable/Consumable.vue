<script>

import {GoodsConsumable} from "@/store/Admin/Goods/Consumable.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {Goods} from "@/store/Admin/Goods/Goods.js";
import {HookGoodsConsumable} from "@/hooks/pages/Goods/Consumable.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: "GoodsConsumable",
  components: {UCheckbox, UInput, UForm, UPopup, UAlert, UActions, UAccordion, UCard, UButton},
  async beforeCreate() {
    const {findGoodsConsumable} = GoodsConsumable()
    const {findMeasureUnits} = MeasureUnits()
    const {findProducts} = Products()
    const {findGoods} = Goods()

    await findGoodsConsumable();
    await findMeasureUnits();
    await findProducts();
    await findGoods();
  },

  setup() {
    const {
      getGoodsConsumable,
      route,
      router,
      consumable,
      submitCreateGoodsConsumable,
      submitUpdateGoodsConsumable,
      submitUpdateBalanceGoodsConsumable,
      submitDeleteGoodsConsumable,
    } = HookGoodsConsumable()
    const {findGoodsConsumable} = GoodsConsumable()
    const {getMeasureUnits} = MeasureUnits()
    const {getProducts} = Products()
    const {getGoods, findGoods} = Goods()

    watch(() => route.params.warehouse,
        () => {
          findGoodsConsumable()
          findGoods()
        }
    )

    const computedConsumable = computed(() => {
      return getGoodsConsumable.value.map(item => {
        item.binding = item.binding.map(binding => {
          binding.good_item = getGoods.value.find(good => good.id === binding.good)
          binding.product_item = getProducts.value.find(product => product.id === binding.good_item?.product)
          binding.measure = getMeasureUnits.value.find(measure => measure.id === binding.product_item?.measure_unit)
          return binding
        })
        return item
      })
    })

    const products = computed(() => {
      return getProducts.value.filter(product => getGoods.value.find(good => good.product === product.id)).map(product => {
        product.goods = getGoods.value.filter(good => good.product === product.id)
        product.measure = getMeasureUnits.value.find(measure => measure.id === product.measure_unit)
        return product
      })
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

    const checkedGood = ({value, checked}) => {
      if (checked) {
        consumable.binding.value.push(value)
      } else {
        consumable.binding.value = consumable.binding.value.filter(bind => bind !== value)
      }
    }

    const changeRoute = (to) => {
      if (to.name === "GoodsConsumable") {
        consumable.title.value.value = ''
        consumable.few.value.value = 0
        consumable.few_very.value.value = 0
        consumable.sort.value.value = 0
        consumable.balance.value.value = 0
        consumable.binding.value = []

        consumable.title.value.tacked = false


        document.body.removeAttribute("style");
        return;
      }

      if ((to.name === 'GoodsConsumableUpdate') || (to.name === 'GoodsConsumableUpdateBalance' && to.params.id)) {
        if (!getGoodsConsumable.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findConsumable = getGoodsConsumable.value.find(cons => +cons.id === +route.params.id)
        consumable.title.value.value = findConsumable.title
        consumable.few.value.value = findConsumable.few
        consumable.few_very.value.value = findConsumable.few_very
        consumable.balance.value.value = findConsumable.balance
        consumable.sort.value.value = findConsumable.sort
        consumable.binding.value = findConsumable.binding.map(bind => bind.good)

        consumable.title.value.tacked = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    const copyData = () => {
      let copyText = ['Название\tКоличество', ...computedConsumable.value.map(item => `${item.title.replace("н-а ", "")}\t${item.balance}`)].join('\n')
      navigator.clipboard.writeText(copyText)
    }

    return {
      getGoodsConsumable,
      route,
      router,
      consumable,
      submitCreateGoodsConsumable,
      submitUpdateGoodsConsumable,
      submitUpdateBalanceGoodsConsumable,
      submitDeleteGoodsConsumable,
      getMeasureUnits,
      getProducts,
      getGoods,
      computedConsumable,
      actions,
      products,
      checkedGood,
      copyData
    }
  }
}
</script>

<template>
  <div class="goods-consumable">
    <div class="goods-consumable__buttons">
      <u-button
          @click="router.push({name: 'GoodsConsumableCreate', params: { warehouse: route.params.warehouse }})"
          class="goods-consumable__create"
      >
        Добавить расходник
      </u-button>
      <u-button
          @click="copyData"
          class="goods-consumable__button"
      >
        Скопировать таблицу
      </u-button>
    </div>

    <div class="list goods-consumable__list--mobile">
      <u-card
          v-for="(consumable, id) in computedConsumable"
          class="goods-consumable__item"
          :key="`good-consumable-${consumable.id}`"
          :style="[{'--z-index': computedConsumable.length - id}]"
      >
        <p class="sub-title">{{ consumable.title }}</p>
        <p :class="['text', {'text--bold text--few': +consumable.balance <= +consumable.few && +consumable.balance > +consumable.few_very}, {'text--bold text--few-very': +consumable.balance <= +consumable.few_very}, {'text--null': +consumable.balance === 0}]">
          <b>Остаток: </b> {{ consumable.balance }}
          <span v-if="+consumable.balance === 0">не осталось расходника</span>
          <span v-else-if="+consumable.balance <= +consumable.few && +consumable.balance > +consumable.few_very">мало расходника</span>
          <span v-else-if="+consumable.balance <= +consumable.few_very">очень мало расходника</span>
        </p>
        <u-accordion
            class="goods-consumable__accordion"
            title="Привязанные фасованные товары"
            small
        >
          <div class="goods-consumable__wrapper">
            <p
                v-for="binding in consumable.binding"
                class="text"
                :key="`good-consumable-binding-${binding.id}`"
            >
              {{ binding.product_item?.show_title ? binding.product_item?.show_title : binding.product_item?.title }},
              {{ binding.good_item?.quantity }} {{ binding.measure?.title }}
            </p>
          </div>
        </u-accordion>
        <u-actions
            class="goods-consumable__actions"
            :actions="actions"
            @update="router.push({name: 'GoodsConsumableUpdate', params: {id: consumable.id}})"
            @updateBalance="router.push({name: 'GoodsConsumableUpdateBalance', params: {id: consumable.id}})"
            @delete="router.push({name: 'GoodsConsumableDelete', params: {id: consumable.id}})"
        />
      </u-card>
    </div>

    <div class="list goods-consumable__list">
      <div
          v-for="(consumable, id) in computedConsumable"
          class="goods-consumable__item"
          :key="`good-consumable-${consumable.id}`"
          :style="[{'--z-index': computedConsumable.length - id}]"
      >
        <p class="goods-consumable__sub-title sub-title">{{ consumable.title }}</p>
        <p :class="['text goods-consumable__text', {'text--bold text--few': +consumable.balance <= +consumable.few && +consumable.balance > +consumable.few_very}, {'text--bold text--few-very': +consumable.balance <= +consumable.few_very}, {'text--null': +consumable.balance === 0}]">
          {{ consumable.balance }}
        </p>
        <u-accordion
            class="goods-consumable__accordion"
            title="Привязанные фасованные товары"
            small
        >
          <div class="goods-consumable__wrapper">
            <p
                v-for="binding in consumable.binding"
                class="text"
                :key="`good-consumable-binding-${binding.id}`"
            >
              {{ binding.product_item?.show_title ? binding.product_item?.show_title : binding.product_item?.title }},
              {{ binding.good_item?.quantity }} {{ binding.measure?.title }}
            </p>
          </div>
        </u-accordion>
        <u-actions
            class="goods-consumable__actions"
            :actions="actions"
            @update="router.push({name: 'GoodsConsumableUpdate', params: {id: consumable.id}})"
            @updateBalance="router.push({name: 'GoodsConsumableUpdateBalance', params: {id: consumable.id}})"
            @delete="router.push({name: 'GoodsConsumableDelete', params: {id: consumable.id}})"
        />
      </div>
    </div>
    <u-alert
        v-if="route.name === 'GoodsConsumableDelete' && route.params.id"
        title="Удалить расходник?"
        type="confirm"
        @close="router.push({name: 'GoodsConsumable', params: {warehouse: route.params.warehouse}})"
        @accept="submitDeleteGoodsConsumable"
    />
    <u-popup
        v-if="route.name === 'GoodsConsumableCreate' && getGoods.length && getProducts.length"
        title="Добавление расходника"
        @close="router.push({name: 'GoodsConsumable', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          text="Добавить расходник"
          @submit.prevent="submitCreateGoodsConsumable"
      >
        <div class="list">
          <u-input
              title="Название"
              :start-value="consumable.title.value.value"
              :error="consumable.title.value.error"
              v-model="consumable.title.value.value"
              @change="consumable.title.value.tacked = true"
              @blur="consumable.title.value.tacked = true"
          />
          <u-input
              title="Остаток"
              type="number"
              :start-value="consumable.balance.value.value"
              v-model="consumable.balance.value.value"
          />
          <u-input
              title="Малое количество расходника"
              type="number"
              :start-value="consumable.few.value.value"
              v-model="consumable.few.value.value"
          />
          <u-input
              title="Очень малое количество расходника"
              type="number"
              :start-value="consumable.few_very.value.value"
              v-model="consumable.few_very.value.value"
          />
          <u-card>
            <p class="sub-title">Выбор фасованных товаров</p>
            <div class="list">
              <u-card
                  v-for="product in products"
                  :key="`good-consumable-list-${product.id}`"
              >
                <p class="sub-title">{{ product.title }}</p>
                <div class="list goods-consumable__wrapper">
                  <u-checkbox
                      v-for="good in product.goods"
                      :title="`${good.quantity} ${product.measure?.title ? product.measure?.title : ''}`"
                      name="good"
                      :value="good.id"
                      :checked="!!consumable.binding.value.find(bind => bind === good.id)"
                      @checked="checkedGood"
                      :key="`good-consumable-item-${good.id}`"
                  />
                </div>
              </u-card>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>

    <u-popup
        v-if="(route.name === 'GoodsConsumableUpdate' || route.name === 'GoodsConsumableUpdateBalance') && getGoods.length && getProducts.length && getGoodsConsumable.length"
        :title="route.name === 'GoodsConsumableUpdate' ? 'Изменение расходника' : 'Ищменение отстатка расходника'"
        @close="router.push({name: 'GoodsConsumable', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          :text="route.name === 'GoodsConsumableUpdate' ? 'Изменить расходник' : 'Изменить остаток расходника'"
          @submit.prevent="route.name === 'GoodsConsumableUpdate'? submitUpdateGoodsConsumable() : submitUpdateBalanceGoodsConsumable()"
      >
        <div class="list">

          <u-input
              title="Название"
              :start-value="consumable.title.value.value"
              :error="consumable.title.value.error"
              v-model="consumable.title.value.value"
              @change="consumable.title.value.tacked = true"
              @blur="consumable.title.value.tacked = true"
              :disabled="route.name === 'GoodsConsumableUpdateBalance'"
          />
          <u-input
              title="Остаток"
              type="number"
              :start-value="consumable.balance.value.value"
              v-model="consumable.balance.value.value"
          />
          <u-input
              title="Малое количество расходника"
              type="number"
              :start-value="consumable.few.value.value"
              v-model="consumable.few.value.value"
              :disabled="route.name === 'GoodsConsumableUpdateBalance'"
          />
          <u-input
              title="Очень малое количество расходника"
              type="number"
              :start-value="consumable.few_very.value.value"
              v-model="consumable.few_very.value.value"
              :disabled="route.name === 'GoodsConsumableUpdateBalance'"
          />
          <u-input
              title="Сортировка"
              type="number"
              :start-value="consumable.sort.value.value"
              v-model="consumable.sort.value.value"
              :disabled="route.name === 'GoodsConsumableUpdateBalance'"
          />
          <u-card v-if="route.name === 'GoodsConsumableUpdate'">
            <p class="sub-title">Выбор фасованных товаров</p>
            <div class="list">
              <u-card
                  v-for="product in products"
                  :key="`good-consumable-list-${product.id}`"
              >
                <p class="sub-title">{{ product.title }}</p>
                <div class="list goods-consumable__wrapper">
                  <u-checkbox
                      v-for="good in product.goods"
                      :title="`${good.quantity} ${product.measure?.title ? product.measure?.title : ''}`"
                      name="good"
                      :value="good.id"
                      :checked="!!consumable.binding.value.find(bind => bind === good.id)"
                      @checked="checkedGood"
                      :key="`good-consumable-item-${good.id}`"
                  />
                </div>
              </u-card>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Consumable.scss" scoped/>
