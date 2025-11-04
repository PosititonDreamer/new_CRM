<script>
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {ref} from "vue";

export default {
  components: {UButton, UCard, UPopup},
  name: "OrdersPreview",
  props: {
    order: {
      type: Object,
      required: true,
    },
    openCollect: {
      type: Boolean,
      default: false,
    },
    computedStatus: {
      type: Function,
      required: true,
    },
    computedDetailOrdersComposition: {
      type: Array,
      required: true
    },
    computedDetailOrdersGoods: {
      type: Array,
      required: true
    },
  },
  setup() {
    const openTab = ref('composition')

    return {
      openTab,
    }
  }
}
</script>
<template>
  <u-popup
      v-if="order"
      title="Просмотр заказа"
      @close="$emit('close')"
  >
    <div class="orders-preview">
      <u-button
          v-if="+order.status === 1 && openCollect"
          class="orders-preview__collect"
          @click="$emit('collect')"
      >
        Собрать заказ
      </u-button>
      <p class="orders-preview__track">{{ order.track ? order.track : 'Не присвоен' }}</p>
      <div class="orders-preview__client">
        <p class="orders-preview__text">
          <b>ФИО: </b> {{ order.client.full_name }}
        </p>

        <p class="orders-preview__text">
          <b>Телефон: </b> {{ order.client.phone }}
        </p>
        <p class="orders-preview__text">
          <b>E-mail: </b> {{ order.client.email }}
        </p>
        <p class="orders-preview__text">
          <b>Служба доставки: </b> {{ order.address.delivery }}
        </p>
        <p class="orders-preview__text">
          <b>Адрес доставки: </b> {{ order.address.address }}
        </p>
        <p class="orders-preview__text">
          <b>Количество заказов клиента: </b> {{ order.client.orders_length }}
        </p>
        <p class="orders-preview__text">
          <b>Заказ создал: </b>
          {{ order.creator }}
        </p>
        <p class="orders-preview__text" v-if="+order.status !== 1 && +order.status !== 3">
          <b>Заказ собрал: </b>
          {{ order.assembler ? order.assembler : 'Админ' }}
        </p>
        <p class="orders-preview__text">
          <b>Текущий статус заказа: </b>
          {{ computedStatus(order.status) }}
        </p>
      </div>
      <u-card class="orders-preview__status-list">
        <p class="orders-preview__title">История заказа:</p>
        <div class="orders-preview__status-item" v-for="(status, id) in order.status_list"
             :key="`order-status-${id}`">
          <p class="orders-preview__text">
            <b>Статус заказ: </b>
            {{ computedStatus(status.status) }} {{ new Date(status.date).toLocaleDateString('ru-RU') }}
          </p>
        </div>
      </u-card>
      <div class="orders-preview__tabs">
        <div class="orders-preview__button-list">
          <u-button class="orders-preview__button" @click="openTab='composition'"
                    :disabled="openTab === 'composition'">Изначальный вид заказа
          </u-button>
          <u-button class="orders-preview__button" @click="openTab='goods'" :disabled="openTab === 'goods'">Товары в
            заказе
          </u-button>
        </div>
        <div class="orders-preview__content">
          <div class="orders-preview__item" v-if="openTab === 'composition'">
            <p class="orders-preview__text" v-for="(composition, id) in computedDetailOrdersComposition"
               :key="`composition-${id}`">
              {{ id + 1 }}. {{ composition }}
            </p>
          </div>
          <div class="orders-preview__item" v-if="openTab === 'goods'">
            <p class="orders-preview__text" v-for="(good, id) in computedDetailOrdersGoods" :key="`goods-${id}`">
              {{ id + 1 }}. {{ good.title }}
              <span
                  v-if="+good.quantity > 1"
                  class="orders-preview__over"
              >
                  &nbsp;-&nbsp;{{ good.quantity }} шт.
                </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </u-popup>
</template>

<style lang="scss" src="./OrdersPreview.scss" scoped />