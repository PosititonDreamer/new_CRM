<script>
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import {validateInput} from "@/hooks/validateInput.js";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import {Auth} from "@/store/workers/Auth.js";

export default {
  name: "Auth",
  components: {
    UForm,
    UInput
  },
  setup() {
    const {data:token} = validateInput('String', "", 20);

    const {auth} = Auth()

    const submitAuth = () => {
      token.value.tacked = true
      if(token.value.valid) {
        auth(token.value.value)
      }
    }

    return {
      token, submitAuth
    }
  }
}
</script>
<template>
  <div class="auth">
    <u-form class="auth__form" text="Войти в систему" @submit.prevent="submitAuth">
      <p class="auth__title">Авторизация</p>
      <u-input
          :start-value="token.value"
          title="Токен"
          v-model="token.value"
          :error="token.error"
          @change="token.tacked = true"
          @blur="token.tacked = true"
          type="textarea"
      />
    </u-form>
  </div>
</template>

<style lang="scss" src="./Auth.scss" scoped />