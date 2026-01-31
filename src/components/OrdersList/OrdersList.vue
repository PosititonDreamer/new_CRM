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
  setup({checkStatus, actions}, {emit}) {
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
      if (+status === 5) {
        return 'Возвращен'
      }
      if (+status === 6) {
        return 'Собран без трека'
      }
      if (+status === 7) {
        return 'Добавлен трек'
      }
    }

    const clickOrder = (order, actions) => {
      if (checkStatus) {
        if(actions.filter(action => !!action.status.find(status => +status === +order.status)).find(action => action.name === 'collect')) {
          emit('collect', order.id)
        } else {
          emit('preview', order.id)
        }
      } else {
        if(actions.find(action => action.name === 'collect')) {
          emit('collect', order.id)
        } else {
          emit('preview', order.id)
        }
      }
    }

    return {
      computedStatus, clickOrder
    }
  }
}
</script>

<template>
  <div class="list orders-list orders-list--mobile">
    <u-card class="orders-list__item"
            v-for="(order, id) in orders"
            :key="`order-item-${order.id}`"
            :style="[{'--z-index': orders.length - id}]"
            @click="clickOrder(order, checkStatus ? actions.filter(action => !!action.status.find(status => +status === +order.status)) : actions)"
    >
      <p class="text orders-list__track">
        {{ order.track ? order.track : 'Не присвоен' }}
        <span v-if="order.comment.trim().length" class="orders-list__there-comment"></span>
        <span v-if="order.sale" class="orders-list__there-sale"></span>
      </p>
      <p class="text">
        {{ order.client }}
      </p>
      <p class="text">
        {{ order.show_delivery }}
      </p>
      <p class="text">
        {{ new Date(order.date).toLocaleDateString('ru-RU') }}
      </p>
      <p class="text">
        Количество товаров: {{ order.goods }} <b class="text--bold" v-if="+order.quantity !== +order.goods">({{order.quantity}})</b>
      </p>
      <u-actions
          class="orders-list__actions"
          :actions="checkStatus ? actions.filter(action => !!action.status.find(status => +status === +order.status)).map(action => {
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
            }).filter(action => action) : actions.map(action => {
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

  <div class="list orders-list">
    <div class="orders-list__item"
            v-for="(order, id) in orders"
            :key="`order-item-${order.id}`"
            :style="[{'--z-index': orders.length - id}]"
            @click="clickOrder(order, checkStatus ? actions.filter(action => !!action.status.find(status => +status === +order.status)) : actions)"
    >
      <p class="text orders-list__track">
        {{ order.track ? order.track : 'Не присвоен' }}
        <span v-if="order.comment.trim().length" class="orders-list__there-comment"></span>
        <span v-if="order.sale" class="orders-list__there-sale"></span>
      </p>
      <p class="text orders-list__name">
        {{ order.client }}
      </p>
      <p class="text">
        {{ order.show_delivery }}
      </p>
      <p class="text">
        {{ new Date(order.date).toLocaleDateString('ru-RU') }}
      </p>
      <p class="text">
        {{ order.goods }} <b class="text--bold" v-if="+order.quantity !== +order.goods">({{order.quantity}})</b>
      </p>
      <u-actions
          class="orders-list__actions"
          :actions="checkStatus ? actions.filter(action => !!action.status.find(status => +status === +order.status)).map(action => {
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
            }).filter(action => action) : actions.map(action => {
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
    </div>
  </div>

</template>

<style lang="scss" src="./OrdersList.scss" scoped/>