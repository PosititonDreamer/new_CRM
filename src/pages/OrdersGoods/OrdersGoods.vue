<script>
import {OrdersGoods} from "@/store/Orders/OrdersGoods.js";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: "GoodsList",
  components: {UCheckbox, UCard},
  async beforeCreate() {
    const {findOrdersGoods} = OrdersGoods()

    await findOrdersGoods()
  },
  setup() {
    const {getGoodsOrders} = OrdersGoods()

    return {
      getGoodsOrders
    }
  },
}
</script>
<template>
  <div class="list goods-list">
    <u-checkbox
        v-for="good in getGoodsOrders"
        :title="`${good.show_title ? good.show_title : good.title}, ${good.good_quantity} ${good.measure} - ${good.quantity} шт. (на складе: ${good.balance}; останется ${+good.balance - +good.quantity})`"
        name="goods"
        :value="good.quantity"
        :checked="!!good.complete"
        @checked="good.complete = !good.complete"
        :class="['goods-list__checkbox', {'goods-list__checkbox--complete': !!good.complete}]"
    />
  </div>
</template>
<style lang="scss" src="./OrdersGoods.scss" scoped />
