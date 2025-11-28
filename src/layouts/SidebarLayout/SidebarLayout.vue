<script>
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import {useRoute} from "vue-router";
import {Auth} from "@/store/Workers/Auth.js";

export default {
  name: "SidebarLayout",
  components: {Sidebar},
  setup() {
    const route = useRoute();
    const {getWorker} = Auth()

    return {
      route,
      getWorker
    }
  }
}
</script>
<template>
  <div class="sidebar-layout" v-if="getWorker.name">
    <sidebar />
    <div class="sidebar-layout__content">
      <h2 class="title">{{route.meta.title}}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" src="./SidebarLayout.scss" scoped />