<script>
import {useRoute} from "vue-router";

export default {
  name: "GoodsKit",
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<template>
  <div class="goods-kit">
    {{route.params.warehouse}}
  </div>
</template>

<style lang="scss" src="./Kit.scss" scoped />
