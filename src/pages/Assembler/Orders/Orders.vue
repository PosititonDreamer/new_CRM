<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {HookOrders} from "@/hooks/pages/Orders/index.js";
import {Orders} from "@/store/Orders/Orders.js";
import {ref, watch} from "vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import OrdersList from "@/components/OrdersList/OrdersList.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import OrdersSend from "@/components/OrdersSend/OrdersSend.vue";
import OrdersCollect from "@/components/OrdersCollect/OrdersCollect.vue";
import OrdersPreview from "@/components/OrdersPreview/OrdersPreview.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";

export default {
  name: "AssemblerOrders",
  components: {UCard, UAccordion, OrdersPreview, OrdersCollect, OrdersSend, UAlert, USelect, OrdersList, UInput, UButton},
  async beforeCreate() {
    const {filter} = HookOrders()
    const {findTrack, findOrders} = Orders()
    await findTrack()
    await findOrders({...filter.value})
  },
  setup() {
    const {
      router,
      route,
      copyTracksAll,
      getOrders,
      openBlankList,
      actionsOrders,
      openBlank,
      copyTrack,
      filter,
      changeFilter,
      filterDelivery,
      filterSort,
      getNextPage,
      findNextPage,
      submitSendOrders,
      collectGoods,
      computedDetailOrdersGoods,
      computedBoxesList,
      getOrderDetail,
      order,
      addBox,
      removeBox,
      submitCollectOrders,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      computedDetailOrdersComposition,
      computedStatus,
      clearData,
      tackedOrders
    } = HookOrders()

    const {
      findOrders,
      findOrdersDetail,
      findGoodsList,
    } = Orders()

    const loading = ref(true)
    const filterUpdate = ref(false)

    const changeRoute = async (to) => {
      if (to.name === 'AssemblerOrders') {
        clearData()
        return
      }

      if (to.name === 'AssemblerOrdersPreview' || to.name === 'AssemblerOrdersCollect') {
        await findGoodsList()
        await findOrdersDetail()
      }

      if (to.name === 'AssemblerOrdersCollect') {
        addBox()
      }

      if (to.name === 'AssemblerOrdersSend') {
        tackedOrders.value.push(route.params.id)
      }
    }

    watch(() => route.params.status, async () => {
      filterUpdate.value = false

      if (filter.value.delivery === 'Boxberry' && +route.params.status !== 4 || +route.params.status !== 5) {
        filter.value.delivery = null
      }

      if (+route.params.status !== 4 && +route.params.status !== 5) {
        filter.value.date_end = null
        filter.value.date_start = null
      }

      if (+route.params.status === 4 || +route.params.status === 5) {
        filter.value.sort = 'new'
      } else {
        filter.value.sort = 'old'
      }

      setTimeout(() => {
        filterUpdate.value = true
      })
      await findOrders({...filter.value})
    })
    findOrders({...filter.value})

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)
    
    return {
      loading,
      router,
      route,
      copyTracksAll,
      getOrders,
      openBlankList,
      actionsOrders,
      openBlank,
      copyTrack,
      filter,
      changeFilter,
      filterDelivery,
      filterSort,
      getNextPage,
      findNextPage,
      submitSendOrders,
      collectGoods,
      computedDetailOrdersGoods,
      computedBoxesList,
      getOrderDetail,
      order,
      addBox,
      removeBox,
      submitCollectOrders,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      computedDetailOrdersComposition,
      computedStatus,
      tackedOrders,
      filterUpdate
    }
  }
}
</script>
<template>
  <div class="orders">
    <div class="orders__actions">
      <u-button
          v-if="+route.params.status === 2 || +route.params.status === 6"
          class="orders__create"
          @click="router.push({name: 'AssemblerOrdersSendSeveral'})"
          :disabled="!getOrders.length"
      >
        Отправить заказы
      </u-button>
      <u-button
          v-if="+route.params.status === 2"
          class="orders__create"
          @click="copyTracksAll"
          :disabled="!getOrders.length || !getOrders.find(item => item.delivery === 'CDEK')"
      >
        Скопировать трек-номера
      </u-button>
      <u-button
          v-if="(+route.params.status === 1 || +route.params.status === 2 || +route.params.status === 6) && getOrders.find(item => item.blank)"
          class="orders__create"
          @click="openBlankList"
      >
        Открыть бланки на печать
      </u-button>
    </div>
    <div
        class="orders__filters"
        :key="`status-order-${route.params.status}`"
        v-if="filterUpdate"
    >
      <u-input
          title="Минимальная дата создания"
          type="date"
          min="2025-03-10"
          :max="new Date().toISOString().split('T')[0]"
          v-model="filter.date_start"
          :start-value="filter.date_start"
          @change="changeFilter"
          v-if="+route.params.status === 4 || +route.params.status === 5"
      />
      <u-input
          title="Максимальная дата создания"
          type="date"
          :min="filter.date_start"
          :max="new Date().toISOString().split('T')[0]"
          v-model="filter.date_end"
          :start-value="filter.date_end"
          @change="changeFilter"
          v-if="+route.params.status === 4 || +route.params.status === 5"
      />
      <u-select
          title="Доставка"
          :values="filterDelivery"
          v-model="filter.delivery"
          :start-value="filter.delivery"
          :empty="false"
          @update="changeFilter"
          class="orders__filter-delivery"
      />
      <u-select
          title="Сортировка"
          :values="filterSort"
          v-model="filter.sort"
          :start-value="filter.sort"
          :empty="false"
          @update="changeFilter"
      />
    </div>
    <orders-list
        class="orders__list"
        v-if="getOrders.length"
        :orders="+route.params.status === 6 ? getOrders : getOrders.filter(item => +item.status !== 6)"
        :actions="actionsOrders"
        @collect="e => router.push({name: 'AssemblerOrdersCollect', params: {id: e}})"
        @preview="e => router.push({name: 'AssemblerOrdersPreview', params: {id: e}})"
        @addBlank="e => router.push({name: 'AssemblerOrdersAddBlank', params: {id: e}})"
        @openBlank="openBlank"
        @send="e => router.push({name: 'AssemblerOrdersSend', params: {id: e}})"
        @copyTrack="e => copyTrack(e)"
        :check-status="+route.params.status === 6"
    />
    <u-button
        class="orders__find"
        v-if="getNextPage"
        @click="findNextPage"
    >
      Загрузить еще
    </u-button>
    <u-alert
        v-if="route.name === 'AssemblerOrdersSend' && route.params.id"
        title="Отправить заказ?"
        type="confirm"
        @close="router.push({name: 'AssemblerOrders', params: {status: route.params.status}})"
        @accept="submitSendOrders('AssemblerOrders')"
    />
    <orders-preview
        v-if="route.name === 'AssemblerOrdersPreview' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-detail-orders-composition="computedDetailOrdersComposition"
        :computed-status="computedStatus"
        :order="getOrderDetail"
        openCollect
        onlyGoods
        @close="router.push({name: 'AssemblerOrders'})"
        @collect="router.push({name: 'AssemblerOrdersCollect', params: {id: getOrderDetail.id}})"
    />
    <orders-send
        v-if="route.name === 'AssemblerOrdersSendSeveral' && getOrders.length"
        :tacked-orders="tackedOrders"
        :orders="getOrders.filter(item => +item.status !== 6)"
        @submit="submitSendOrders('AssemblerOrders')"
        @close="router.push({name: 'AssemblerOrders'})"
        @takeOrder="e=> !!tackedOrders.find(item => +item === +e.id) ? tackedOrders = tackedOrders.filter(item => +item !== +e.id) : tackedOrders.push(e.id)"
        @takeAll="tackedOrders = tackedOrders.length === getOrders.filter(item => +item.status !== 6).length ? [] : getOrders.filter(item => +item.status !== 6).map(item => item.id)"
    />
    <orders-collect
        v-if="route.name === 'AssemblerOrdersCollect' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :collect-goods="collectGoods"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-boxes-list="computedBoxesList"
        :order="getOrderDetail"
        :boxes="order.boxes"
        @addBox="addBox()"
        @removeBox="e=>removeBox(e)"
        @submit="submitCollectOrders('AssemblerOrders')"
        @close="router.push({name: 'AssemblerOrders'})"
        @collectGoods="e => !!collectGoods.find(item => +item === +e.id) ? collectGoods = collectGoods.filter(item => +item !== +e.id) : collectGoods.push(e.id)"
    />
  </div>
</template>
<style lang="scss" src="./Orders.scss" scoped/>