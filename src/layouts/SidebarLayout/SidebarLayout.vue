<script>
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import {useRoute} from "vue-router";

export default {
  name: "SidebarLayout",
  components: {Sidebar},
  setup() {
    const route = useRoute();

    return {
      route
    }
  }
}
</script>
<template>
  <div class="sidebar-layout">
    <sidebar />
    <div class="sidebar-layout__content">
      <h2 class="sidebar-layout__title">{{route.meta.title}}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" src="./SidebarLayout.scss" scoped />