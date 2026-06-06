<script>
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import {useRoute} from "vue-router";
import {Auth} from "@/store/Workers/Auth.js";
import {Orders} from "@/store/Orders/Orders.js";
import {OrdersFind} from "@/store/Orders/OrdersFind.js";
import {computed} from "vue";

export default {
  name: "SidebarLayout",
  components: {Sidebar},
  setup() {
    const statuses = [
      {
        id: 0,
        name: 'delivered'
      },
      {
        id: 5,
        name: 'returned'
      },
      {
        id: 4,
        name: 'send'
      },
      {
        id: 6,
        name: 'assembled_not_track'
      },
      {
        id: 2,
        name: 'assembled'
      },
      {
        id: 1,
        name: 'created'
      },
      {
        id: 3,
        name: 'processed'
      }
    ]


    const route = useRoute();
    const {getWorker} = Auth()
    const {getOrders, getUnprocessedOrders} = Orders()
    const {getOrders: getOrdersFind} = OrdersFind()

    const computedText = computed(() =>{
      if(route.name === 'AssemblerOrders' || route.matched.find(item => item.name === 'AssemblerOrders') || route.name === 'Orders' || route.matched.find(item => item.name === 'Orders') || route.name === 'OperatorOrders' || route.matched.find(item => item.name === 'OperatorOrders')) {
        let additionalText = ''
        const status = +route.params.status
        if(status === 0) {
          additionalText = getUnprocessedOrders.value.delivered
        } else if(status === 1) {
          additionalText = getUnprocessedOrders.value.created
        }else if(status === 2) {
          additionalText = getUnprocessedOrders.value.assembled
        }else if(status === 3) {
          additionalText = +getUnprocessedOrders.value.processed + +getUnprocessedOrders.value.assembled_not_track
        }else if(status === 4) {
          additionalText = getUnprocessedOrders.value.send
        }else if(status === 5) {
          additionalText = getUnprocessedOrders.value.returned
        }else if(status === 6) {
          additionalText = +getUnprocessedOrders.assembled_not_track + +getUnprocessedOrders.assembled_add_track
        }

        return `${additionalText} (${getOrders.value.length})`
      } else if(route.name === 'OrdersFind' || route.name === 'OperatorOrdersFind') {
        return getOrdersFind.value.length
      }
      return null
    })

    return {
      route,
      getWorker,
      getOrdersFind,
      computedText,
      getUnprocessedOrders
    }
  }
}
</script>
<template>
  <div class="sidebar-layout" v-if="getWorker.name">
    <sidebar/>
    <div class="sidebar-layout__content">
      <h2 class="title">{{ route.meta.title }}
        <template v-if="computedText">{{computedText}}</template>
      </h2>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" src="./SidebarLayout.scss" scoped/>