<script>
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import {computed} from "vue";

export default {
  name: 'OrdersList',
  components: {UCard, UActions},
  props: {
    actions: {
      type: Array,
      required: true
    },
    orders: {
      type: Array,
      required: true
    },
    checkStatus: {
      type: Boolean,
      default: false
    },
    checkBlank: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const computedStatus = (status) => {
      if (+status === 1) {
        return 'Создан'
      }
      if (+status === 2) {
        return 'Собран'
      }
      if (+status === 3) {
        return 'В обработке'
      }
      if (+status === 4) {
        return 'Отправлен'
      }
      return 'Возвращен'
    }

    return {
      computedStatus
    }
  }
}
</script>

<template>
  <div class="orders-list">
    <u-card class="orders-list__item"
            v-for="(order, id) in orders"
            :key="`order-item-${order.id}`"
            :style="[{'--z-index': orders.length - id}]"
    >
      <p class="orders-list__title">{{ order.track ? order.track : 'Не присвоен' }}</p>
      <div class="orders-list__wrapper">
        <p class="orders-list__text">
          <b>Статус: </b> {{ computedStatus(order.status) }}
        </p>
        <p class="orders-list__text">
          <b>Клиент: </b> {{ order.client }}
        </p>
        <p class="orders-list__text">
          <b>Доставка: </b> {{ order.delivery }}
        </p>
        <p class="orders-list__text">
          <b>Дата создания: </b> {{ new Date(order.date).toLocaleDateString('ru-RU') }}
        </p>
        <p class="orders-list__text">
          <b>Количество товаров: </b> {{ order.goods }}
        </p>
        <p class="orders-list__text" v-if="order.comment.trim().length">
          <b>Комментарий: </b> {{ order.comment }}
        </p>
        <p :class="['orders-list__text', {'orders-list__text--alarm': !order.blank}]"
           v-if="order.delivery !== 'CDEK' && (+order.status === 1 || +order.status === 2) && checkBlank">
          <b>Бланк для печати: </b> {{ order.blank ? "Загружен" : "Не загружен" }}
        </p>
      </div>
      <u-actions
          class="orders-list__actions"
          :actions="checkStatus ? actions.filter(action => !!action.status.find(status => +status === +order.status)) : actions.map(action => {
              if (action.name === 'addBlank') {
                if (order.delivery !== 'CDEK') {
                  return {
                    text: order.blank ? 'Изменить бланк' : 'Добавить бланк',
                    name: 'addBlank'
                  }
                } else {
                  return null
                }
              } else if (action.name === 'openBlank') {
                if (order.delivery === 'CDEK') {
                  return null
                } else if (!order.blank) {
                  return null
                } else {
                  return action
                }
              } else {
                return action
              }
            }).filter(action => action)
          "
          @collect="$emit('collect', order.id)"
          @preview="$emit('preview', order.id)"
          @update="$emit('update', order.id)"
          @delete="$emit('delete', order.id)"
          @addBlank="$emit('addBlank', order.id)"
          @openBlank="$emit('openBlank', order.id)"
          @sendMessage="$emit('sendMessage', order.id)"
          @addTrack="$emit('addTrack', order.id)"
          @return="$emit('return', order.id)"
          @send="$emit('send', order.id)"
          @copyTrack="$emit('copyTrack', order)"
      />
    </u-card>
  </div>
</template>

<style lang="scss" src="./OrdersList.scss" scoped/>