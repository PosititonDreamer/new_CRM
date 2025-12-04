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
    const route = useRoute();
    const {getWorker} = Auth()
    const {getOrders, getUnprocessedOrders} = Orders()
    const {getOrders: getOrdersFind} = OrdersFind()

    const computedText = computed(() =>{
      if(route.name === 'AssemblerOrders' || route.matched.find(item => item.name === 'AssemblerOrders') || route.name === 'Orders' || route.matched.find(item => item.name === 'Orders') || route.name === 'OperatorOrders' || route.matched.find(item => item.name === 'OperatorOrders')) {
        return getOrders.value.length
      } else if(route.name === 'OrdersFind' || route.name === 'OperatorOrdersFind') {
        return getOrdersFind.value.length
      }
      return null
    })

    return {
      route,
      getWorker,
      getOrders,
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