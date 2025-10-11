<script>
import {Loader} from "@/store/Loader.js";

export default {
  name: 'ULoader',
  setup() {
    const {getLoader} = Loader()

    return {
      getLoader
    }
  }
}
</script>

<template>
  <div class="u-loader" v-if="getLoader.find(load => !load.status)">
    <span>
    </span>
  </div>
</template>

<style lang="scss" src="./ULoader.scss" scoped />