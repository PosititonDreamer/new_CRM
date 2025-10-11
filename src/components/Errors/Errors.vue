<script>
import {Errors} from "@/store/Errors.js";

export default {
  name: 'Errors',
  setup() {
    const {getErrors, removeErrors} = Errors();

    return {
      getErrors,removeErrors
    }
  }
}
</script>

<template>
  <div class="errors" v-if="getErrors.length">
    <p class="errors__item" v-for="error in getErrors" @click="removeErrors(error.id)">
      {{error.message}}
    </p>
  </div>
</template>

<style lang="scss" src="./Errors.scss" scoped />