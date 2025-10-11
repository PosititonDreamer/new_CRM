<script>
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";
import SidebarLayout from "@/layouts/SidebarLayout/SidebarLayout.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import Errors from "@/components/Errors/Errors.vue";
import ULoader from "@/components/_UIComponents/ULoader/ULoader.vue";
import {Auth} from "@/store/workers/Auth.js";
import router from "@/router/router.js";

export default {
  components: {
    ULoader,
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

    const {auth} = Auth()

    if(localStorage.getItem('token')) {
      auth(localStorage.getItem('token'))
    } else {
      router.push('/')
    }
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
