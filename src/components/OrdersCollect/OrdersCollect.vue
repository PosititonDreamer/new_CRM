<script>
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";

export default {
  name: "OrdersCollect",
  components: {UButton, USelect, UCheckbox, UCard, UPopup, UForm},
  props: {
    order: {
      type: Object,
      required: true,
    },
    computedBoxesList: {
      type: Array,
      required: true,
    },
    computedDetailOrdersGoods: {
      type: Array,
      required: true,
    },
    collectGoods: {
      type: Array,
      required: true,
    },
    boxes: {
      type: Array,
      required: true,
    }
  }
}
</script>
<template>
  <u-popup
      title="Сбор заказа"
      @close="$emit('close')"
  >
    <u-form
        text="Собрать заказ"
        @submit.prevent="$emit('submit')"
    >
      <div class="orders-collect">
        <p class="orders-collect__track">{{ order.track }}</p>
        <div class="orders-collect__client">
          <p class="orders-collect__text">
            <b>ФИО: </b> {{ order.client.full_name }}
          </p>
          <p class="orders-collect__text">
            <b>Служба доставки: </b> {{ order.address.delivery }}
          </p>
          <p class="orders-collect__text">
            <b>Адрес доставки: </b> {{ order.address.address }}
          </p>
          <p class="orders-collect__text">
            <b>Количество заказов клиента: </b> {{ order.client.orders_length }}
          </p>
        </div>
      </div>
      <u-card>
        <p class="orders-collect__text">Выбор коробок</p>
        <u-card
            v-for="(item, id) in boxes.value"
            :key="`good-order-item${item.id}`"
            :class="['orders-collect__form-item', {'orders-collect__form-item--division': boxes.value.length > 1}]"
            :style="[{'--z-index': boxes.value.length - id}]"
        >
          <u-select
              title="Коробка"
              :values="computedBoxesList"
              :start-value="item.box.value"
              :error="item.box.error"
              v-model="item.box.value"
              @change="item.box.tacked = true"
              class="orders-collect__select"
          />
          <u-button
              v-if="boxes.value.length > 1"
              type="button"
              modifier="red"
              class="orders-collect__delete-box"
              @click="$emit('removeBox',item.id)"
          />
        </u-card>
        <u-button
            v-if="boxes.value.length < 2"
            type="button"
            @click="$emit('addBox')"
            class="orders-collect__add-box"
        >
          Добавить коробку
        </u-button>
      </u-card>
      <p class="orders-collect__text">Состав заказа:</p>
      <u-card
          v-for="good in computedDetailOrdersGoods"
          :key="`order-good-item-${good.id}-${good.type}`"
          :class="['orders-collect__card', {'orders-collect__card--collect': collectGoods.find(item => +item === +good.id)}]">
        <div class="orders-collect__info">
          <u-checkbox
              title=""
              name="order-collect-good-item"
              :value="good.id"
              :checked="!!collectGoods.find(item => +item === +good.id)"
              @checked="!!collectGoods.find(item => +item === +good.id) ? collectGoods = collectGoods.filter(item => +item !== +good.id) : collectGoods.push(good.id)"
              :key="`order-good-check-item-${good.id}-${good.type}`"
          />
          <p class="orders-collect__name">
            {{ good.title }}
            <span
                v-if="+good.quantity > 1"
                class="orders-collect__over"
            >
                  &nbsp;-&nbsp;{{ good.quantity }} шт.
                </span>
          </p>
        </div>
        <p
            v-if="good.quantity > 1"
            class="orders-collect__alarm"
        >
          Обрати внимание на количество товара
        </p>
      </u-card>
    </u-form>
  </u-popup>
  
</template>
<style lang="scss" src="./OrdersCollect.scss" scoped />