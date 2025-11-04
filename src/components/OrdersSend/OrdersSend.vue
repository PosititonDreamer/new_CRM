<script>
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: "OrdersSend",
  components: {UCheckbox, UCard, UPopup, UForm},
  props: {
    orders: {
      type: Array,
      required: true,
    },
    tackedOrders: {
      type: Array,
      required: true,
    }
  }
}
</script>
<template>
  <u-popup
      title="Отправка заказов"
      v-if="orders.length"
      @close="$emit('close')"
  >
    <u-form
        text="Отправить заказы"
        @submit.prevent="$emit('submit')"
    >
      <u-checkbox
          title="Выбрать все"
          name="order-collect-good-item"
          value="all"
          :checked="tackedOrders.length === orders.length"
          @checked="tackedOrders = tackedOrders.length === orders.length ? [] : orders.map(item => item.id)"
          :key="`order-check-item-all`"
          class="orders-send__take-all"
      />
      <u-card
          v-for="order in orders"
          :key="`order-item-${order.id}`"
          :class="['orders-send__card', {'orders-send__card--collect': tackedOrders.find(item => +item === +order.id)}]">
        <div class="orders-send__info">
          <u-checkbox
              title=""
              name="order-collect-good-item"
              :value="order.id"
              :checked="!!tackedOrders.find(item => +item === +order.id)"
              @checked="!!tackedOrders.find(item => +item === +order.id) ? tackedOrders = tackedOrders.filter(item => +item !== +order.id) : tackedOrders.push(order.id)"
              :key="`order-check-item-${order.id}`"
          />
          <p class="orders-send__name">
            {{ order.delivery }} {{ order.track }} {{ order.client }}
          </p>
        </div>
      </u-card>
    </u-form>
  </u-popup>
</template>
<style lang="scss" src="./OrdersSend.scss" scoped />