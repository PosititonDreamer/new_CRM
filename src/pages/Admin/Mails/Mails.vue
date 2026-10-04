<script>
import {Mails} from "@/store/Admin/Mails/Mails.js";
import {HookMails} from "@/hooks/pages/Mails/index.js";
import {ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";

export default {
  components: {UActions, UAccordion, UCard, UAlert, USelect, UInput, UForm, UPopup, UButton},
  async beforeCreate() {
    const {findMails} = Mails()

    await findMails()
  },
  setup() {
    const {
      router,
      route,
      mailTypes,
      orderTypes,
      clearData,
      mail,
      getMails,
      getMailsList,
      submitCreateMail,
      submitUpdateMail,
      submitDeleteMail,
    } = HookMails()
    const {sendTestMail} = Mails()

    const loading = ref(true)

    const changeRoute = (to) => {
      if (to.name === "Mails") {
        clearData()

        document.body.removeAttribute("style");
        return;
      }
      if (to.name === 'MailsUpdate' && to.params.id) {
        loading.value = false;
        if (!getMails.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findMail = getMails.value.find((item) => item.id === to.params.id)
        mail.order_type.value.value = findMail.order_type
        mail.mail_type.value.value = findMail.mail_type
        mail.text.value.value = findMail.text
        mail.min_orders.value.value = findMail.min_orders
        mail.max_orders.value.value = findMail.max_orders

        mail.order_type.value.tacked = true
        mail.mail_type.value.tacked = true
        mail.text.value.tacked = true
        mail.min_orders.value.tacked = true
        mail.max_orders.value.tacked = true

        setTimeout(() => {
          loading.value = true
        }, 10)
      }
    }

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "remove",
        text: "Удалить"
      },
      {
        name: "send_test",
        text: "Отправить тест"
      }
    ])

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      actions,
      loading,
      router,
      route,
      mailTypes,
      orderTypes,
      mail,
      getMails,
      getMailsList,
      submitCreateMail,
      submitUpdateMail,
      submitDeleteMail,
      sendTestMail,
    }
  }
}
</script>
<template>
  <div class="mails">
    <u-button class="mails__create" @click="router.push({name: 'MailsCreate'})">Добавить письмо</u-button>

    <div class="list mails__list">
      <u-card
          v-for="item in getMailsList"
      >
        <u-accordion
            :title="item.name"
        >
          <div class="list">
            <template
                v-for="child in item.list"
            >
              <u-card
                  v-if="child.list.length"
              >
                <u-accordion :title="child.name">
                  <div class="list">
                    <u-card
                        class="mails__item"
                        v-for="(mailItem, id) in child.list"
                        :key="`mails-${mailItem.id}`"
                        :style="[{'--z-index': child.list.length - id}]"
                    >

                      <div class="mails__content">
                        <p class="text">
                          Кол-во заказов {{mailItem.min_orders}}{{mailItem.max_orders ? `-${mailItem.max_orders}` : ''}}
                        </p>
                        <p class="sub-title">Текст из письма: </p>
                        <p class="text" v-html="mailItem.text.replace(/\n/g, '<br>')"></p>
                      </div>
                      <u-actions
                          class="mails__actions"
                          :actions="actions"
                          @remove="router.push({name: 'MailsDelete', params: {id: mailItem.id}})"
                          @update="router.push({name: 'MailsUpdate', params:{id: mailItem.id}})"
                          @send_test="sendTestMail(mailItem.id)"
                          :key="`mails-actions-${mailItem.id}`"
                      />
                    </u-card>
                  </div>
                </u-accordion>
              </u-card>
            </template>
          </div>
        </u-accordion>
      </u-card>
    </div>

    <u-alert
        v-if="route.name === 'MailsDelete' && route.params.id"
        title="Удалить письмо?"
        type="confirm"
        @close="router.push({name: 'Mails'})"
        @accept="submitDeleteMail()"
    />

    <u-popup
        v-if="route.name === 'MailsCreate'"
        title="Добавление письма"
        @close="router.push({name: 'Mails'})"
    >
      <u-form
          text="Добавить письмо"
          @submit.prevent="submitCreateMail"
      >
        <div class="list">
          <u-select
              title="Тип письма"
              :values="mailTypes"
              v-model="mail.mail_type.value.value"
              :start-value="mail.mail_type.value.value"
              @change="mail.mail_type.value.tacked = true"
              :error="mail.mail_type.value.error"
              class="mails__select"
          />
          <u-select
              title="Тип заказа"
              :values="orderTypes"
              v-model="mail.order_type.value.value"
              :start-value="mail.order_type.value.value"
              @change="mail.order_type.value.tacked = true"
              :error="mail.order_type.value.error"
          />
          <u-input
              title="Минимум заказов"
              type="number"
              v-model="mail.min_orders.value.value"
              :start-value="mail.min_orders.value.value"
              @blur="mail.min_orders.value.tacked = true"
              :error="mail.min_orders.value.error"
              @change="mail.min_orders.value.tacked = true"
          />
          <u-input
              title="Максимум заказов"
              type="number"
              v-model="mail.max_orders.value.value"
              :start-value="mail.max_orders.value.value"
              @blur="mail.max_orders.value.tacked = true"
              :error="mail.max_orders.value.error"
              @change="mail.max_orders.value.tacked = true"
          />
          <u-input
              :rows="16"
              type="textarea"
              title="Текст"
              v-model="mail.text.value.value"
              :start-value="mail.text.value.value"
              @blur="mail.text.value.tacked = true"
              :error="mail.text.value.error"
              @change="mail.text.value.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'MailsUpdate' && loading"
        title="Изменение письма"
        @close="router.push({name: 'Mails'})"
    >
      <u-form
          text="Изменить письмо"
          @submit.prevent="submitUpdateMail"
      >
        <div class="list">
          <u-select
              title="Тип письма"
              :values="mailTypes"
              v-model="mail.mail_type.value.value"
              :start-value="mail.mail_type.value.value"
              @change="mail.mail_type.value.tacked = true"
              :error="mail.mail_type.value.error"
              class="mails__select"
          />
          <u-select
              title="Тип заказа"
              :values="orderTypes"
              v-model="mail.order_type.value.value"
              :start-value="mail.order_type.value.value"
              @change="mail.order_type.value.tacked = true"
              :error="mail.order_type.value.error"
          />
          <u-input
              title="Минимум заказов"
              type="number"
              v-model="mail.min_orders.value.value"
              :start-value="mail.min_orders.value.value"
              @blur="mail.min_orders.value.tacked = true"
              :error="mail.min_orders.value.error"
              @change="mail.min_orders.value.tacked = true"
          />
          <u-input
              title="Максимум заказов"
              type="number"
              v-model="mail.max_orders.value.value"
              :start-value="mail.max_orders.value.value"
              @blur="mail.max_orders.value.tacked = true"
              :error="mail.max_orders.value.error"
              @change="mail.max_orders.value.tacked = true"
          />
          <u-input
              :rows="16"
              type="textarea"
              title="Текст"
              v-model="mail.text.value.value"
              :start-value="mail.text.value.value"
              @blur="mail.text.value.tacked = true"
              :error="mail.text.value.error"
              @change="mail.text.value.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./Mails.scss" scoped/>