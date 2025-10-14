<script>
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";
import SidebarLayout from "@/layouts/SidebarLayout/SidebarLayout.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import ULoader from "@/components/_UIComponents/ULoader/ULoader.vue";
import Messages from "@/components/Messages/Messages.vue";

export default {
  components: {
    ULoader,
    Messages,
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
  <Messages />
  <ULoader />
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>
