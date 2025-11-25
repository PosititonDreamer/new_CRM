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

    return {
      computedProducts,
      getMeasureUnits,
      getGoods
    }
  }
}
</script>
<template>
  <div class="goods">
    <div class="list goods__list">
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
                <b>Артикль: </b> {{ good.article }}
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
            </u-card>
          </div>
        </u-accordion>
      </u-card>
    </div>
  </div>
</template>
<style lang="scss" src="./Goods.scss" scoped/>