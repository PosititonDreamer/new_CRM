<script>
import {Assembler} from "@/store/Assembler/Assembler.js";
import {useRoute} from "vue-router";
import {watch} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";

export default {
  name: "AssemblerGoodsOther",
  components: {UActions, UCard},
  async beforeCreate() {
    const {findGoodsOther} = Assembler()

    await findGoodsOther()
  },
  setup() {

    const {
      getGoodsOther,
      getGoodsOtherType,
      findGoodsWeight
    } = Assembler()

    const route = useRoute()

    watch(() => route.params.warehouse,
        () => {
          findGoodsWeight()
        }
    )

    return {
      getGoodsOther,
      getGoodsOtherType,
    }
  }
}
</script>
<template>
  <div class="goods-other">
    <div class="goods-other__list">
      <u-card
          v-for="(other,id) in getGoodsOther"
          class="goods-other__item"
          :key="`good-other-${other.id}`"
          :style="[{'--z-index': getGoodsOther.length - id}]"
      >
        <p class="goods-other__title">{{other.title}}</p>
        <div class="goods-other__content">
          <p class="goods-other__text">
            <b>Тип: </b> {{getGoodsOtherType.find(type => +type.id === +other.type)?.title}}
          </p>
          <p :class="['goods-other__text', {'goods-other__text--few': +other.balance <= +other.few && +other.balance > +other.few_very}, {'goods-other__text--few-very': +other.balance <= +other.few_very}]">
            <b>Остаток: </b> {{other.balance}}
            <span v-if="+other.balance <= +other.few && +other.balance > +other.few_very">мало расходника</span>
            <span v-if="+other.balance <= +other.few_very">очень мало расходника</span>
          </p>
        </div>
      </u-card>
    </div>

  </div>
</template>
<style lang="scss" src="./Other.scss" scoped />