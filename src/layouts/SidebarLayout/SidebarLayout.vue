<script>
import Sidebar from "@/components/Sidebar/Sidebar.vue";

export default {
  name: "SidebarLayout",
  components: {Sidebar}
}
</script>
<template>
  <div class="sidebar-layout">
    <sidebar />
    <div class="sidebar-layout__content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" src="./SidebarLayout.scss" scoped />