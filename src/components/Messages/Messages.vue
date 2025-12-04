<script>
import {Messages} from "@/store/Messages.js";

export default {
  name: 'Messages',
  setup() {
    const {getMessages, removeMessages} = Messages();

    return {
      getMessages,removeMessages
    }
  }
}
</script>

<template>
  <div class="list messages" v-if="getMessages.length">
    <p :class="`text messages__item messages__item--${message.type}`" v-for="message in getMessages.filter(item => item.type !== 'success')" @click="removeMessages(message.id)">
      {{message.message}}
    </p>
  </div>
</template>

<style lang="scss" src="./Messages.scss" scoped />