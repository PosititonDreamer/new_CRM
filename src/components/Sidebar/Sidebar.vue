<script>
import {computed, ref} from "vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {useRoute} from "vue-router";

export default {
  name: "Sidebar",
  components: {UAccordion},
  setup() {
    const open = ref(false)
    const openAccordion = ref("")
    const openSidebar = () => {
      open.value = true
      document.body.style.overflow = "hidden"
    }

    const closeSidebar = () => {
      open.value = false
      document.body.removeAttribute("style")
    }


    const route = useRoute()
    if(route.meta.page) {
      openAccordion.value = route.meta.page
    }



    return {
      open,
      openSidebar,
      closeSidebar,
      openAccordion
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
      <div class="sidebar__list">
        <u-accordion class="sidebar__accordion" title="Продукты" :open="openAccordion === 'products'" @open="openAccordion = openAccordion === 'products' ? '' : 'products'">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Products'}">Продукты</router-link>
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Other'}">Кривые продукты</router-link>
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'MeasureUnits'}">Единицы измерения</router-link>
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Packing'}">Упаковки</router-link>
        </u-accordion>
        <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Warehouses'}">Склады</router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Sidebar.scss" scoped />