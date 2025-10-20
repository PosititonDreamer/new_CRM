<script>
import {useRoute} from "vue-router";

export default {
  name: "Goods",
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<template>
  <div class="goods">
    {{route.params.warehouse}}
  </div>
</template>

<style lang="scss" src="./Goods.scss" scoped />
