<script>
import {useRoute} from "vue-router";

export default {
  name: "GoodsConsumable",
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<template>
  <div class="goods-consumable">
    {{route.params.warehouse}}
  </div>
</template>

<style lang="scss" src="./Consumable.scss" scoped />
