<script>
import {useRoute} from "vue-router";

export default {
  name: "GoodsOther",
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<template>
  <div class="goods-other">
    {{route.params.warehouse}}
  </div>
</template>

<style lang="scss" src="./Other.scss" scoped />
