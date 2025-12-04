<script>
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {ref} from "vue";
import {Messages} from "@/store/Messages.js";

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
    onlyGoods: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const openTab = ref('goods')

    const {addMessages} = Messages()

    const copyTrack = (track, delivery) => {
      if (!track) return
      if (delivery === 'CDEK') {
        navigator.clipboard.writeText(track.replace(/\s/g, ""))
      } else {
        navigator.clipboard.writeText(track)
      }
      addMessages(['Трек-номер скопированы'], 'success')
    }

    return {
      openTab,
      copyTrack
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
      <p class="title" @click="copyTrack(order.track, order.address.delivery)">{{ order.track ? order.track : 'Не присвоен' }}</p>
      <p class="text text--big text--few-back" v-if="order.comment.length">
        <b>Комментарий: </b> {{ order.comment }}
      </p>
      <template v-if="onlyGoods">
        <div class="orders-preview__tabs">
          <u-card class="orders-preview__content">
            <div class="orders-preview__item">
              <p class="text" v-for="(good, id) in computedDetailOrdersGoods" :key="`goods-${id}`">
                {{ id + 1 }}. {{ good.title }}
                <span
                    v-if="+good.quantity > 1"
                    class="text--bold"
                >
                  &nbsp;-&nbsp;{{ good.quantity }} шт.
                </span>
              </p>
            </div>
          </u-card>
        </div>
      </template>
      <template v-else>
        <div class="orders-preview__tabs">
          <div class="orders-preview__button-list">
            <u-button class="orders-preview__button" @click="openTab='goods'" :disabled="openTab === 'goods'">Товары в
              заказе
            </u-button>
            <u-button class="orders-preview__button" @click="openTab='composition'"
                      :disabled="openTab === 'composition'">Изначальный вид заказа
            </u-button>
          </div>
          <u-card class="orders-preview__content">
            <div class="orders-preview__item" v-if="openTab === 'composition'">
              <p class="text" v-for="(composition, id) in computedDetailOrdersComposition"
                 :key="`composition-${id}`">
                {{ id + 1 }}. {{ composition }}
              </p>
            </div>
            <div class="orders-preview__item" v-if="openTab === 'goods'">
              <p class="text" v-for="(good, id) in computedDetailOrdersGoods" :key="`goods-${id}`">
                {{ id + 1 }}. {{ good.title }}
                <span
                    v-if="+good.quantity > 1"
                    class=" text--bold"
                >
                  &nbsp;-&nbsp;{{ good.quantity }} шт.
                </span>
              </p>
            </div>
          </u-card>
        </div>
      </template>
      <p class="text">
        <b>ФИО: </b> {{ order.client.full_name }}
      </p>

      <p class="text">
        <b>Телефон: </b> {{ order.client.phone }}
      </p>
      <p class="text">
        <b>E-mail: </b> {{ order.client.email }}
      </p>
      <p class="text">
        <b>Служба доставки: </b> {{ order.address.delivery }}
      </p>
      <p class="text">
        <b>Адрес доставки: </b> {{ order.address.address }}
      </p>
      <p class="text">
        <b>Количество заказов клиента: </b> {{ order.client.orders_length }}
      </p>
      <p class="text">
        <b>Заказ создал: </b>
        {{ order.creator }}
      </p>
      <p class="text" v-if="+order.status !== 1 && +order.status !== 3">
        <b>Заказ собрал: </b>
        {{ order.assembler ? order.assembler : 'Админ' }}
      </p>
      <p class="text">
        <b>Текущий статус заказа: </b>
        {{ computedStatus(order.status) }}
      </p>
      <u-card
          class="orders-preview__status-list"
      >
        <p class="title">История заказа:</p>
        <p
            class="text"
            v-for="(status, id) in order.status_list"
            :key="`order-status-${id}`"
        >
          <b>Статус заказ: </b>
          {{ computedStatus(status.status) }} {{ new Date(status.date).toLocaleDateString('ru-RU') }} {{ status.time }}
        </p>
      </u-card>
    </div>
  </u-popup>
</template>

<style lang="scss" src="./OrdersPreview.scss" scoped/>