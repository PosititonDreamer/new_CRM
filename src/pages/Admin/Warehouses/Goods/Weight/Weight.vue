<script>
import {useRoute} from "vue-router";

export default {
  name: "GoodsWeight",
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<template>
  <div class="goods-weight">
    {{route.params.warehouse}}
  </div>
</template>

<style lang="scss" src="./Weight.scss" scoped />
