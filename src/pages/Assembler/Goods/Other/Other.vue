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
    <div class="list goods-other__list">
      <u-card
          v-for="(other,id) in getGoodsOther"
          class="goods-other__item"
          :key="`good-other-${other.id}`"
          :style="[{'--z-index': getGoodsOther.length - id}]"
      >
        <p class="sub-title">{{ other.title }}</p>
        <p class="text">
          <b>Тип: </b> {{ getGoodsOtherType.find(type => +type.id === +other.type)?.title }}
        </p>
        <p :class="['text', {'text--bold text--few': +other.balance <= +other.few && +other.balance > +other.few_very}, {'text--bold text--few-very': +other.balance <= +other.few_very}, {'text--null': +other.balance === 0}]">
          <b>Остаток: </b> {{ other.balance }}
          <span v-if="+other.balance === 0">не осталось {{+other.type === 1 ? 'магнитов' : 'коробок'}}</span>
          <span v-else-if="+other.balance <= +other.few && +other.balance > +other.few_very">мало {{+other.type === 1 ? 'магнитов' : 'коробок'}}</span>
          <span v-else-if="+other.balance <= +other.few_very">очень мало {{+other.type === 1 ? 'магнитов' : 'коробок'}}</span>
        </p>

      </u-card>
    </div>
  </div>
</template>
<style lang="scss" src="./Other.scss" scoped />