<script>
import {Mailings} from "@/store/Admin/Mailing/Mailings.js";
import {HookMailings} from "@/hooks/pages/Mailings/index.js";
import {ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";

export default {
  name: "Mailings",
  components: {UAlert, UInput, UForm, UPopup, UAccordion, UActions, UCard, UButton},
  async beforeCreate() {
    const {findMailings} = Mailings()

    await findMailings()
  },
  setup() {
    const {
      router,
      route,
      title,
      text,
      getMailings,
      submitCreateMailings,
      submitUpdateMailings,
      submitDeleteMailings,
      sendMailingsTestTelegram,
      sendMailingsTelegram,
      sendMailingsTestEmail,
      sendMailingsEmail,
      actionsMailings
    } = HookMailings()

    const loading = ref(true)

    const changeRoute = (to) => {
      if (to.name === "Mailings") {
        title.value.value = ''
        text.value.value = ''

        title.value.tacked = false
        text.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }
      if (to.name === 'MailingsUpdate' && to.params.id) {
        loading.value = false
        if (!getMailings.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findMailing = getMailings.value.find((item) => item.id === to.params.id)

        title.value.value = findMailing.title
        text.value.value = findMailing.start_text

        title.value.tacked = true
        text.value.tacked = true
        setTimeout(() => {
          loading.value = true
        })

      }

    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      router,
      route,
      title,
      text,
      getMailings,
      submitCreateMailings,
      submitUpdateMailings,
      submitDeleteMailings,
      sendMailingsTestTelegram,
      sendMailingsTelegram,
      sendMailingsTestEmail,
      sendMailingsEmail,
      loading,
      actionsMailings
    }
  }
}
</script>
<template>
  <div class="mailings">
    <u-button
        class="mailings__create"
        @click="router.push({name: 'MailingsCreate'})"
    >
      Добавить рассылку
    </u-button>
    <div class="list mailings__list">
      <u-card
          v-for="(mailing, id) in getMailings"
          :key="`mailing-${mailing.id}`"
          :style="[{'--z-index': getMailings.length - id}]"
          class="mailings__item"
      >
        <u-actions
            class="mailings__actions"
            :actions="actionsMailings"
            :key="`mailing-actions-${mailing.id}`"
            @remove="router.push({name: 'MailingsDelete', params: {id: mailing.id}})"
            @update="router.push({name: 'MailingsUpdate', params: {id: mailing.id}})"
            @testTelegram="router.push({name: 'MailingsTestTelegram', params: {id: mailing.id}})"
            @testEmail="router.push({name: 'MailingsTestEmail', params: {id: mailing.id}})"
            @telegram="router.push({name: 'MailingsTelegram', params: {id: mailing.id}})"
            @email="router.push({name: 'MailingsEmail', params: {id: mailing.id}})"
        />
        <p class="sub-title">
          {{ mailing.title }}
        </p>
        <u-accordion
            title="Текст рассылки"
        >
          <p class="text" v-html="mailing.text" />
        </u-accordion>
      </u-card>
    </div>
    <u-popup
        v-if="route.name === 'MailingsCreate'"
        title="Добавление рассылки"
        @close="router.push({name: 'Mailings'})"
    >
      <u-form
          text="Добавить рассылку"
          @submit.prevent="submitCreateMailings"
      >
        <div class="list">
          <u-input
              title="Тема рассылки"
              v-model="title.value"
              :start-value="title.value"
              @change="title.tacked = true"
              @blur="title.tacked = true"
              :error="title.error"
          />

          <u-input
              :rows="16"
              type="textarea"
              title="Текст рассылки"
              v-model="text.value"
              :start-value="text.value"
              @change="text.tacked = true"
              @blur="text.tacked = true"
              :error="text.error"
          />
        </div>
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'MailingsUpdate' && loading"
        title="Изменение рассылки"
        @close="router.push({name: 'Mailings'})"
    >
      <u-form
          text="Изменить рассылку"
          @submit.prevent="submitUpdateMailings"
      >
        <div class="list">
          <u-input
              title="Тема рассылки"
              v-model="title.value"
              :start-value="title.value"
              @change="title.tacked = true"
              @blur="title.tacked = true"
              :error="title.error"
          />

          <u-input
              :rows="16"
              type="textarea"
              title="Текст рассылки"
              v-model="text.value"
              :start-value="text.value"
              @change="text.tacked = true"
              @blur="text.tacked = true"
              :error="text.error"
          />
        </div>
      </u-form>
    </u-popup>

    <u-alert
        v-if="route.name === 'MailingsDelete' && route.params.id"
        title="Удалить рассылку?"
        type="confirm"
        @close="router.push({name: 'Mailings'})"
        @accept="submitDeleteMailings()"
    />

    <u-alert
        v-if="route.name === 'MailingsTestTelegram' && route.params.id"
        title="Отправить тест в телеграмм?"
        type="confirm"
        @close="router.push({name: 'Mailings'})"
        @accept="sendMailingsTestTelegram()"
    />

    <u-alert
        v-if="route.name === 'MailingsTestEmail' && route.params.id"
        title="Отправить тест на email?"
        type="confirm"
        @close="router.push({name: 'Mailings'})"
        @accept="sendMailingsTestEmail()"
    />

    <u-alert
        v-if="route.name === 'MailingsTelegram' && route.params.id"
        title="Отправить рассылку в телеграмм?"
        type="confirm"
        @close="router.push({name: 'Mailings'})"
        @accept="sendMailingsTelegram()"
    />

    <u-alert
        v-if="route.name === 'MailingsEmail' && route.params.id"
        title="Отправить рассылку на email?"
        type="confirm"
        @close="router.push({name: 'Mailings'})"
        @accept="sendMailingsEmail()"
    />

  </div>
</template>
<style lang="scss" src="./Mailings.scss" scoped />