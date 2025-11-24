<script>
import {Assembler} from "@/store/Assembler/Assembler.js";
import {computed, watch} from "vue";
import {useRoute} from "vue-router";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";

export default {
  name: "AssemblerGoodsWeight",
  components: {UActions, UCard},
  async beforeCreate() {
    const {findGoodsWeight} = Assembler()

    await findGoodsWeight()
  },
  setup() {
    const {
      getProducts,
      getGoodsWeight,
      getMeasureUnits,
      findGoodsWeight,
    } = Assembler()

    const route = useRoute()

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

    return {
      computedProducts,

    }
  }
}
</script>
<template>
  <div class="goods-weight">
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
      </u-card>
    </div>

  </div>
</template>
<style lang="scss" src="./Weight.scss" scoped />