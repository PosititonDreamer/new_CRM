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
    const {getMaxOrders} = Orders()
    const {getOrders: getOrdersFind} = OrdersFind()

    return {
      route,
      getWorker,
      getOrdersFind,
      getMaxOrders
    }
  }
}
</script>
<template>
  <div class="sidebar-layout" v-if="getWorker.name">
    <sidebar/>
    <div class="sidebar-layout__content">
      <h2 class="title">{{ route.meta.title }}
        <template v-if="getMaxOrders && route.name.indexOf('Orders') > -1">{{getMaxOrders}}</template>
      </h2>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" src="./SidebarLayout.scss" scoped/>