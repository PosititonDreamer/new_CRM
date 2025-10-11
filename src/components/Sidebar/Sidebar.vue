<script>
import {ref} from "vue";

export default {
  name: "Sidebar",
  setup() {
    const open = ref(false)

    const openSidebar = () => {
      open.value = true
      document.body.style.overflow = "hidden"
    }

    const closeSidebar = () => {
      open.value = false
      document.body.removeAttribute("style")
    }

    return {
      open,
      openSidebar,
      closeSidebar
    }
  }
}
</script>

<template>
  <button class="sidebar-open" @click="openSidebar">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <div :class="['sidebar', {'sidebar--open': open}]">
    <div class="sidebar__content">
      <button class="sidebar__close" @click="closeSidebar"></button>
      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/admin/products">Продукты</router-link>
    </div>
  </div>
</template>
<style lang="scss" src="./Sidebar.scss" scoped />