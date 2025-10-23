<script>
import {useRoute} from "vue-router";
import {GoodsWeight} from "@/store/Admin/Goods/Weight.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {HookGoodsWeight} from "@/hooks/pages/Goods/Weight.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: "GoodsWeight",
  components: {UCheckbox, UInput, USelect, UForm, UPopup, UAlert, UActions, UCard, UButton},
  async beforeCreate() {
    const {findGoodsWeight} = GoodsWeight()
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()

    await findGoodsWeight()
    await findProducts()
    await findMeasureUnits()
  },
  setup() {
    const {
      getGoodsWeight,
      route,
      router,
      goodWeight,
      addCompositeItem,
      removeCompositeItem,
      submitCreateGoodsWeight,
      submitUpdateGoodsWeight,
      submitUpdateBalanceGoodsWeight,
      submitDeleteGoodsWeight,
    } = HookGoodsWeight()

    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()
    const {findGoodsWeight} = GoodsWeight()

    watch(() => route.params.warehouse,
        () => {
          findGoodsWeight()
        }
    )

    const computedProducts = computed(() => {
      return getProducts.value.filter(product => !!getGoodsWeight.value.find(item => item.product === product.id)).map(product => {
        product.weight = getGoodsWeight.value.find(item => item.product === product.id)
        product.measure = getMeasureUnits.value.find(measure => measure.id === product.measure_unit)
        if (!!+product.weight.composite) {
          product.weight.composite_list?.map(composite => {
            const weight_item = getGoodsWeight.value.find(weight => weight.id === composite.weight)
            if(weight_item) {
              composite.product = getProducts.value.find(item => item.id === weight_item.product)
            }
            return composite
          })
        }
        return product
      })
    })

    const products = computed(() => {
      return getProducts.value.map(product => {
        return {
          name: product.show_title ? product.show_title : product.title,
          value: product.id
        }
      })
    })

    const changeComposite = (e) => {
      goodWeight.composite.value = e.checked
      if(e.checked) {
        addCompositeItem()
      } else {
        goodWeight.compositeList.value = []
      }
    }

    const sum = computed(() => {
      let sum = 0
      goodWeight.compositeList.value.forEach(item => {
        sum += +item.proportion.value
      })
      return sum === 100
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

    const changeRoute = (to) => {
      if (to.name === "GoodsWeight") {
        goodWeight.product.value.value = ''
        goodWeight.few.value.value = 0
        goodWeight.few_very.value.value = 0
        goodWeight.balance.value.value = 0
        goodWeight.composite.value = false
        goodWeight.compositeList.value = []

        goodWeight.product.value.tacked = false
        goodWeight.few.value.tacked = false
        goodWeight.few_very.value.tacked = false
        goodWeight.balance.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }

      if((to.name === 'GoodsWeightUpdate') || (to.name === 'GoodsWeightUpdateBalance' && to.params.id)) {
        if (!getGoodsWeight.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findWeight = getGoodsWeight.value.find(weight => +weight.id === +route.params.id)
        goodWeight.product.value.value = findWeight.product
        goodWeight.few.value.value = +findWeight.few
        goodWeight.few_very.value.value = +findWeight.few_very
        goodWeight.balance.value.value = +findWeight.balance
        goodWeight.composite.value = !!+findWeight.composite
        if(goodWeight.composite.value) {
          findWeight.composite_list.forEach(item => {
            addCompositeItem({
              weight_composite: getGoodsWeight.value.find(weight => weight.id === item.weight).product,
              proportion: +item.proportion,
            }, item.id)
          })
        }
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)


    return {
      getGoodsWeight,
      route,
      router,
      goodWeight,
      getProducts,
      getMeasureUnits,
      addCompositeItem,
      removeCompositeItem,
      submitCreateGoodsWeight,
      submitUpdateGoodsWeight,
      submitUpdateBalanceGoodsWeight,
      submitDeleteGoodsWeight,
      products,
      computedProducts,
      actions,
      changeComposite,
      sum,
    }
  }
}
</script>

<template>
  <div class="goods-weight">
    <u-button
        class="goods-weight__create"
        @click="router.push({name: 'GoodsWeightCreate', params: { warehouse: route.params.warehouse }})"
    >
      Добавить весовой товар
    </u-button>
    <div class="goods-weight__list">
      <u-card
          v-for="(product, id) in computedProducts"
          class="goods-weight__item"
          :key="`good-weight-product-${product.id}`"
          :style="[{'--z-index': computedProducts.length - id}]"
      >
        <p class="goods-weight__title">{{ product.show_title ? product.show_title : product.title }}</p>
        <div class="goods-weight__content">
          <p
              :class="['goods-weight__text', {'goods-weight__text--few': +product.weight.balance <= +product.weight.few && +product.weight.balance > +product.weight.few_very}, {'goods-weight__text--few-very': +product.weight.balance <= +product.weight.few_very}]"
              v-if="!+product.weight.composite"
          >
            <b>Остаток: </b> {{ product.weight.balance }} {{ product.measure?.title }}
            <span
                v-if="+product.weight.balance <= +product.weight.few && +product.weight.balance > +product.weight.few_very">мало товара</span>
            <span v-if="+product.weight.balance <= +product.weight.few_very">очень мало товара</span>
          </p>
          <p class="goods-weight__text goods-weight__text--composite" v-else>
            <span><b>Составной товар:</b></span>
            <span
                v-for="composite in product.weight.composite_list"
                class="goods-weight__sub-text"
                :key="`good-weight-composite-${composite.id}`"
            >
                <b>{{ composite.product.show_title ? composite.product.show_title : composite.product.title }}: </b> {{ composite.proportion }}%
              </span>
          </p>
        </div>
        <u-actions
            class="goods-weight__actions"
            :actions="!+product.weight.composite ? actions : actions.filter(action => action.name !== 'updateBalance')"
            @update="router.push({name: 'GoodsWeightUpdate', params: {id: product.weight.id}})"
            @updateBalance="router.push({name: 'GoodsWeightUpdateBalance', params: {id: product.weight.id}})"
            @delete="router.push({name: 'GoodsWeightDelete', params: {id: product.weight.id}})"
        />
      </u-card>
    </div>
    <u-alert
        v-if="route.name === 'GoodsWeightDelete' && route.params.id"
        title="Удалить весовой товар?"
        type="confirm"
        @close="router.push({name: 'GoodsWeight', params: {warehouse: route.params.warehouse}})"
        @accept="submitDeleteGoodsWeight"
    />
    <u-popup
        v-if="route.name === 'GoodsWeightCreate' && getProducts.length && getMeasureUnits.length"
        title="Добавление весового товара"
        @close="router.push({name: 'GoodsWeight', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          text="Добавить весовой товар"
          @submit.prevent="submitCreateGoodsWeight"
      >
        <u-select
            title="Продукт"
            :values="products.filter(product => !getGoodsWeight.find(weight => +weight.product === +product.value))"
            :start-value="goodWeight.product.value.value"
            :error="goodWeight.product.value.error"
            v-model="goodWeight.product.value.value"
            class="goods-weight__select"
            @change="goodWeight.product.value.tacked = true"
        />
        <u-input
            title="Остаток"
            type="number"
            :start-value="goodWeight.balance.value.value"
            v-model="goodWeight.balance.value.value"
            v-if="!goodWeight.composite.value"
        />
        <u-input
            title="Малое количество товара"
            type="number"
            :start-value="goodWeight.few.value.value"
            v-model="goodWeight.few.value.value"
            v-if="!goodWeight.composite.value"
        />
        <u-input
            title="Очень малое количество товара"
            type="number"
            :start-value="goodWeight.few_very.value.value"
            v-model="goodWeight.few_very.value.value"
            v-if="!goodWeight.composite.value"
        />
        <u-checkbox
            title="Составной товар"
            name="composite"
            value="1"
            :checked="!!goodWeight.composite.value"
            @checked="changeComposite"
        />
        <u-card class="goods-weight__wrapper" v-if="goodWeight.composite.value">
          <p class="goods-weight__title">Пропорции</p>
          <p v-if="!sum" class="goods-weight__error">Сумма пропорций должна составлять 100%</p>
          <u-card
              v-for="(item, id) in goodWeight.compositeList.value"
              :class="['goods-weight__form-item', {'goods-weight__form-item--division': goodWeight.compositeList.value.length > 1}]"
              :key="`goods-weight-proportion-${item.id}`"
              :style="[{'--z-index': goodWeight.compositeList.value.length - id}]"
          >
            <u-input
                title="Пропорция в %"
                type="number"
                :start-value="item.proportion.value"
                :error="item.proportion.error"
                v-model="item.proportion.value"
                @change="item.proportion.tacked = true"
                @blur="item.proportion.tacked = true"
            />
            <u-select
                title="Весовой товар"
                :values="products
                  .filter(product => product.value !== goodWeight.product.value.value)
                  .filter(product => getGoodsWeight.find(weight => weight.product === product.value && !+weight.composite))
                  .filter(product => item.weight_composite.value === product.value || !goodWeight.compositeList.value.find(weight => weight.weight_composite.value === product.value))
                "
                :start-value="item.weight_composite.value"
                :error="item.weight_composite.error"
                v-model="item.weight_composite.value"
                class="goods-weight__select-composite"
                @change="item.weight_composite.tacked = true"
            />
            <u-button
              v-if="goodWeight.compositeList.value.length > 1"
              type="button"
              modifier="red"
              class="goods-weight__delete-composite"
              @click="removeCompositeItem(item.id)"
            />
          </u-card>
          <u-button
              v-if="(getGoodsWeight.length - 1 - goodWeight.compositeList.value.length)  > 0"
              type="button"
              class="goods-weight__add-composite"
              @click="addCompositeItem()"
          >
            Добавить пропорцию
          </u-button>
        </u-card>
      </u-form>
    </u-popup>

    <u-popup
        v-if="(route.name === 'GoodsWeightUpdate' || route.name === 'GoodsWeightUpdateBalance') && getProducts.length && getMeasureUnits.length && getGoodsWeight.length "
        :title="route.name === 'GoodsWeightUpdate' ? 'Изменение весового товара' : 'Изменение остатка весового товара'"
        @close="router.push({name: 'GoodsWeight', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          :text="route.name === 'GoodsWeightUpdate' ? 'Изменить весовой товар' : 'Изменить остаток весового товара'"
          @submit.prevent="route.name === 'GoodsWeightUpdate' ? submitUpdateGoodsWeight() : submitUpdateBalanceGoodsWeight()"
      >
        <u-select
            title="Продукт"
            :values="products.filter(product => !getGoodsWeight.find(weight => +weight.product === +product.value && weight.product !== goodWeight.product.value.value))"
            :start-value="goodWeight.product.value.value"
            :error="goodWeight.product.value.error"
            v-model="goodWeight.product.value.value"
            class="goods-weight__select"
            @change="goodWeight.product.value.tacked = true"
            :disabled="route.name === 'GoodsWeightUpdateBalance'"
        />
        <u-input
            title="Остаток"
            type="number"
            :start-value="goodWeight.balance.value.value"
            v-model="goodWeight.balance.value.value"
            v-if="!goodWeight.composite.value"
        />
        <u-input
            title="Малое количество товара"
            type="number"
            :start-value="goodWeight.few.value.value"
            v-model="goodWeight.few.value.value"
            v-if="!goodWeight.composite.value"
            :disabled="route.name === 'GoodsWeightUpdateBalance'"
        />
        <u-input
            title="Очень малое количество товара"
            type="number"
            :start-value="goodWeight.few_very.value.value"
            v-model="goodWeight.few_very.value.value"
            v-if="!goodWeight.composite.value"
            :disabled="route.name === 'GoodsWeightUpdateBalance'"
        />
        <u-checkbox
            v-if="route.name === 'GoodsWeightUpdate'"
            title="Составной товар"
            name="composite"
            value="1"
            :checked="!!goodWeight.composite.value"
            @checked="changeComposite"
        />
        <u-card class="goods-weight__wrapper" v-if="goodWeight.composite.value">
          <p class="goods-weight__title">Пропорции</p>
          <p v-if="!sum" class="goods-weight__error">Сумма пропорций должна составлять 100%</p>
          <u-card
              v-for="(item, id) in goodWeight.compositeList.value"
              :class="['goods-weight__form-item', {'goods-weight__form-item--division': goodWeight.compositeList.value.length > 1}]"
              :key="`goods-weight-proportion-${item.id}`"
              :style="[{'--z-index': goodWeight.compositeList.value.length - id}]"
          >
            <u-input
                title="Пропорция в %"
                type="number"
                :start-value="item.proportion.value"
                :error="item.proportion.error"
                v-model="item.proportion.value"
                @change="item.proportion.tacked = true"
                @blur="item.proportion.tacked = true"
            />
            <u-select
                title="Весовой товар"
                :values="products
                  .filter(product => product.value !== goodWeight.product.value.value)
                  .filter(product => getGoodsWeight.find(weight => weight.product === product.value && !+weight.composite))
                  .filter(product => item.weight_composite.value === product.value || !goodWeight.compositeList.value.find(weight => weight.weight_composite.value === product.value))
                "
                :start-value="item.weight_composite.value"
                :error="item.weight_composite.error"
                v-model="item.weight_composite.value"
                class="goods-weight__select-composite"
                @change="item.weight_composite.tacked = true"
            />
            <u-button
                v-if="goodWeight.compositeList.value.length > 1"
                type="button"
                modifier="red"
                class="goods-weight__delete-composite"
                @click="removeCompositeItem(item.id)"
            />
          </u-card>
          <u-button
              v-if="(getGoodsWeight.length - 1 - goodWeight.compositeList.value.length)  > 0"
              type="button"
              class="goods-weight__add-composite"
              @click="addCompositeItem()"
          >
            Добавить пропорцию
          </u-button>
        </u-card>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Weight.scss" scoped/>
