<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {HookOrdersFind} from "@/hooks/pages/Orders/OrdersFind.js";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import OrdersList from "@/components/OrdersList/OrdersList.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import {OrdersFind} from "@/store/Orders/OrdersFind.js";
import OrdersPreview from "@/components/OrdersPreview/OrdersPreview.vue";
import {watch} from "vue";
import {HookOrders} from "@/hooks/pages/Orders/index.js";
import {Orders} from "@/store/Orders/Orders.js";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";

export default {
  name: 'OperatorOrdersFind',
  components: {UAlert, OrdersPreview, UForm, UPopup, UCard, OrdersList, UInput, USelect, UButton},
  async beforeCreate() {
    const {clearOrders} = OrdersFind()
    const {findGoodsList} = Orders()

    clearOrders()
    await findGoodsList()
  },
  setup() {
    const {
      route,
      router,
      getOrders,
      submitFindOrders,
      submitDeleteOrders,
      submitReturnOrders,
      typesList,
      type,
      text,
      actionsList,
      sendTelegramMessage
    } = HookOrdersFind()

    const {
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      getOrderDetail,
      computedDetailOrdersGoods,
      computedDetailOrdersComposition,
      computedStatus,
    } = HookOrders()
    const {findOrdersDetail} = Orders()

    const changeRoute = async (to) => {
      if(to.name === 'OperatorOrdersFindPreview') {
        await findOrdersDetail()
      }
    }
    watch(route, (to) => {
      changeRoute(to)
    })
    changeRoute(route)

    return {
      route,
      router,
      getOrders,
      submitFindOrders,
      submitDeleteOrders,
      submitReturnOrders,
      typesList,
      type,
      text,
      actionsList,
      sendTelegramMessage,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      getOrderDetail,
      computedDetailOrdersGoods,
      computedDetailOrdersComposition,
      computedStatus,
    }
  }
}
</script>

<template>
  <div class="orders-find">
    <u-button
        class="orders-find__setting"
        @click="router.push({name: 'OperatorOrdersFindSetting'})"
    >
      Настройки поиска
    </u-button>
    <u-popup
        v-if="route.name === 'OperatorOrdersFindSetting'"
        title="Настройка поиска"
        @close="router.push({name: 'OperatorOrdersFind'})"
    >
      <u-form
          text="Найти заказы"
          @submit.prevent="submitFindOrders('OperatorOrdersFind')"
      >
        <div class="list">
          <u-select
              title="Поиск по"
              :values="typesList"
              :start-value="type.value"
              v-model="type.value"
              @change="type.tacked = true"
              empty
          />
          <u-input
              :title="`${type.value === 'track' ? 'Трек-номер' : 'ФИО'}`"
              v-model="text.value"
              :start-value="text.value"
              :error="text.error"
              @change="text.tacked = true"
              @blur="text.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
    <orders-list
        v-if="getOrders.length > 0"
        :orders="getOrders"
        :actions="actionsList"
        check-status
        @sendMessage="e => sendTelegramMessage(e)"
        @delete="e => router.push({name: 'OperatorOrdersFindDelete', params: {id: e}})"
        @preview="e => router.push({name: 'OperatorOrdersFindPreview', params: {id: e}})"
        @return="e => router.push({name: 'OperatorOrdersFindReturn', params: {id: e}})"
    />
    <orders-preview
        v-if="route.name === 'OperatorOrdersFindPreview' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-detail-orders-composition="computedDetailOrdersComposition"
        :computed-status="computedStatus"
        :order="getOrderDetail"
        @close="router.push({name: 'OperatorOrdersFind'})"
    />
    <u-alert
        v-if="route.name === 'OperatorOrdersFindDelete' && route.params.id"
        title="Удалить заказ?"
        type="confirm"
        @close="router.push({name: 'OperatorOrdersFind', params: {status: route.params.status}})"
        @accept="submitDeleteOrders('OperatorOrdersFind')"
    />
    <u-alert
        v-if="route.name === 'OperatorOrdersFindReturn' && route.params.id"
        title="Вернуть?"
        type="confirm"
        @close="router.push({name: 'OperatorOrdersFind', params: {status: route.params.status}})"
        @accept="submitReturnOrders('OperatorOrdersFind')"
    />
  </div>
</template>

<style lang="scss" src="./Find.scss" scoped />