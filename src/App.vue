<script>
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";
import SidebarLayout from "@/layouts/SidebarLayout/SidebarLayout.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import Errors from "@/components/Errors/Errors.vue";

export default {
  components: {
    Errors,
    DefaultLayout,
    SidebarLayout,
  },
  beforeCreate() {
    const resize = () => {
      document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`)
    }
    resize()

    window.addEventListener('resize', resize)
  },
  setup() {
    const route = useRoute()
    const layout = computed(() => {
      if(route.meta.layout) {
        return `${route.meta.layout}Layout`
      }
      return 'DefaultLayout'
    })

    return {
      layout
    }
  }
}
</script>

<template>
  <Errors />
  <ULoader />
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>
