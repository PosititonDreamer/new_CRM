<script>
import {Assembler} from "@/store/Assembler/Assembler.js";
import {computed, ref, watch} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {useRoute} from "vue-router";

export default {
  name: "AssemblerGoods",
  components: {UAccordion, UActions, UCard},
  async beforeCreate() {
    const {findGoods} = Assembler()

    await findGoods()
  },
  setup() {
    const {
      getProducts,
      getGoods,
      getMeasureUnits,
      findGoods,
      getWarehouses
    } = Assembler()

    const route = useRoute()

    watch(() => route.params.warehouse,
        () => {
          findGoods()
        }
    )

    const computedProducts = computed(() => {
      return getProducts.value.filter(product => !!getGoods.value.find(item => item.product === product.id))
    })

    const viewPrice = computed(() => {
      return +getWarehouses.value.find(item => item.id === route.params.warehouse)?.type === 1
    })

    return {
      computedProducts,
      getMeasureUnits,
      getGoods,
      viewPrice,
    }
  }
}
</script>
<template>
  <div class="goods">
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
            v-for="(good, id) in getGoods.filter(item => item.product === product.id)"
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
        </template>
      </div>
    </div>

    <div class="list goods__list--mobile">
      <u-card class="goods__item" v-for="product in computedProducts" :key="`goods-item-product${product.id}`">
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
  </div>
</template>
<style lang="scss" src="./Goods.scss" scoped/>