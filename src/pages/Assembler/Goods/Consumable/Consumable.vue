<script>
import {Assembler} from "@/store/Assembler/Assembler.js";
import {useRoute} from "vue-router";
import {computed, ref, watch} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";

export default {
  name: "AssemblerGoodsConsumable",
  components: {UAccordion, UActions, UCard},
  async beforeCreate() {
    const {
      findGoods,
      findGoodsConsumable,
    } = Assembler()

    await findGoods();
    await findGoodsConsumable();
  },
  setup() {
    const {
      findGoodsConsumable,
      findGoods,
      getGoodsConsumable,
      getMeasureUnits,
      getProducts,
      getGoods,

    } = Assembler();

    const route = useRoute()

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

    return {
      computedConsumable,
    }
  }
}
</script>
<template>
  <div class="goods-consumable">

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
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Consumable.scss" scoped />