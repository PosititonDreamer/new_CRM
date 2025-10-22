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
  <div class="messages" v-if="getMessages.length">
    <p :class="`messages__item messages__item--${message.type}`" v-for="message in getMessages" @click="removeMessages(message.id)">
      {{message.message}}
    </p>
  </div>
</template>

<style lang="scss" src="./Messages.scss" scoped />