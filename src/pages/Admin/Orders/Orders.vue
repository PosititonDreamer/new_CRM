<script>
import {HookOrders} from "@/hooks/pages/Orders/index.js";
import {Orders} from "@/store/Orders/Orders.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import OrdersList from "@/components/OrdersList/OrdersList.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import OrdersPreview from "@/components/OrdersPreview/OrdersPreview.vue";
import OrdersSend from "@/components/OrdersSend/OrdersSend.vue";
import OrdersCollect from "@/components/OrdersCollect/OrdersCollect.vue";

export default {
  name: 'Orders',
  components: {
    OrdersCollect,
    OrdersSend, OrdersPreview, UAlert, UCheckbox, UCard, UForm, UPopup, OrdersList, UInput, USelect, UButton
  },
  async beforeCreate() {
    const {filter} = HookOrders()
    const {findTrack, checkOld, findOrders} = Orders()
    await findTrack()
    await checkOld()
    await findOrders({...filter.value})
  },
  setup() {
    const {
      router,
      route,
      getOrders,
      getNextPage,
      getOrderDetail,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      sendTelegramMessage,
      filter,
      addComposition,
      removeComposition,
      submitCreateOrders,
      submitUpdateOrders,
      submitDeleteOrders,
      submitReturnOrders,
      submitCollectOrders,
      submitSendOrders,
      submitAddTrack,
      submitAddBlank,
      order,
      addBox,
      removeBox,
      actionsOrders,
      filterDelivery,
      filterSort,
      compositionTypes,
      clearData,
      computedStatus,
      computedGoods,
      computedProducts,
      computedKits,
      computedPresents,
      computedDetailOrdersComposition,
      computedDetailOrdersGoods,
      computedBoxesList,
      collectGoods,
      tackedOrders,
      changeFilter,
      findNextPage,
      openBlank,
      openBlankList,
      copyTracksAll,
      copyTrack,
      copyNumber,
    } = HookOrders()

    const {
      findOrders,
      findOrdersDetail,
      findGoodsList,
      findClientsList,
      getClientsList,
      clearClientsList
    } = Orders()

    const loading = ref(true)

    const changeRoute = async (to) => {
      if (to.name === 'Orders') {
        clearData()
        return
      }

      if (to.name === 'OrdersCreate' || to.name === 'OrdersUpdate' || to.name === 'OrdersPreview' || to.name === 'OrdersCollect' || to.name === 'OrdersAddTrack' || to.name === 'OrdersAddBlank') {
        await findGoodsList()
        if (to.name !== 'OrdersCreate') {
          await findOrdersDetail()
        } else {
          addComposition()
        }
      }

      if (to.name === 'OrdersUpdate') {
        loading.value = false
        if (getOrderDetail.value) {
          order.comment.value.value = getOrderDetail.value.comment
          order.track.value.value = getOrderDetail.value.track
          order.client.value.value = getOrderDetail.value.client.full_name
          order.phone.value.value = getOrderDetail.value.client.phone
          order.email.value.value = getOrderDetail.value.client.email
          order.address.value.value = getOrderDetail.value.address.address
          order.delivery.value.value = getOrderDetail.value.address.delivery
          order.payed.value = !!getOrderDetail.value.number
          getOrderDetail.value.composition_list.forEach(composition => {
            const item = {
              good: composition.good,
              quantity: composition.quantity,
              type: composition.type
            }

            if (composition.type === 'good') {
              const good = getGoodsList.value.find(good => +good.id === +composition.good)
              item.product = good.product
            }

            if (!!+composition.present) {
              item.type = 'present'
            }
            addComposition(item, composition.id)
          })
          setTimeout(() => {
            loading.value = true
          })
        } else {
          changeRoute(to)
        }
      }
      if (to.name === 'OrdersCollect') {
        addBox()
      }

      if (to.name === 'OrdersSend') {
        tackedOrders.value.push(route.params.id)
      }
    }

    watch(() => route.params.status, async () => {
      await findOrders({...filter.value})
    })
    findOrders({...filter.value})

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    let timeout

    const findClients = () => {
      clearTimeout(timeout)
      clearClientsList()
      if (order.client.value.value.trim().length > 2) {
        timeout = setTimeout(() => {
          findClientsList(order.client.value.value)
        }, 300)
      }
    }

    const selectClient = (client, address) => {
      loading.value = false
      const findClient = getClientsList.value.find(item => item.id === client)
      const findAddress = findClient.address.find(item => item.id === address)
      order.client.value.value = findClient.full_name
      order.email.value.value = findClient.email
      order.phone.value.value = findClient.phone
      order.delivery.value.value = findAddress.delivery
      order.address.value.value = findAddress.address
      clearClientsList()
      setTimeout(() => {
        clearTimeout(timeout)
        loading.value = true
      }, 10)
    }

    return {
      getOrders,
      router,
      route,
      getNextPage,
      findNextPage,
      filter,
      filterDelivery,
      filterSort,
      changeFilter,
      actionsOrders,
      sendTelegramMessage,
      openBlank,
      openBlankList,
      addComposition,
      removeComposition,
      order,
      addBox,
      removeBox,
      getGoodsList,
      getProductsList,
      getPresentsList,
      computedGoods,
      computedProducts,
      compositionTypes,
      computedKits,
      getKitsList,
      computedPresents,
      submitCreateOrders,
      findClients,
      getClientsList,
      selectClient,
      loading,
      submitUpdateOrders,
      getOrderDetail,
      computedStatus,
      computedDetailOrdersComposition,
      computedDetailOrdersGoods,
      computedBoxesList,
      collectGoods,
      submitCollectOrders,
      submitDeleteOrders,
      submitReturnOrders,
      submitSendOrders,
      tackedOrders,
      copyTracksAll,
      copyTrack,
      submitAddTrack,
      submitAddBlank,
      copyNumber
    }
  }
}
</script>

<template>
  <div class="orders">
    <div class="orders__actions">
      <u-button
          v-if="+route.params.status === 1"
          class="orders__create"
          @click="router.push({name: 'OrdersCreate'})"
      >
        Добавить заказ
      </u-button>
      <u-button
          v-if="+route.params.status === 2  || +route.params.status === 6"
          class="orders__create"
          @click="router.push({name: 'OrdersSendSeveral'})"
          :disabled="!getOrders.length || !getOrders.find(item => item.delivery === 'CDEK') || (+route.params.status === 6 && !getOrders.find(item => +item.status === 7))"
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
          v-if="(+route.params.status === 1 || +route.params.status === 2  || +route.params.status === 6) && getOrders.find(item => item.blank)"
          class="orders__create"
          @click="openBlankList"
      >
        Открыть бланки на печать
      </u-button>
    </div>
    <div class="orders__filters">
      <u-input
          title="Минимальная дата создания"
          type="date"
          min="2025-03-10"
          :max="new Date().toISOString().split('T')[0]"
          v-model="filter.date_start"
          :start-value="filter.date_start"
          @change="changeFilter"
      />
      <u-input
          title="Максимальная дата создания"
          type="date"
          :min="filter.date_start"
          :max="new Date().toISOString().split('T')[0]"
          v-model="filter.date_end"
          :start-value="filter.date_end"
          @change="changeFilter"
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
        :orders="getOrders"
        :actions="actionsOrders"
        @collect="e => router.push({name: 'OrdersCollect', params: {id: e}})"
        @preview="e => router.push({name: 'OrdersPreview', params: {id: e}})"
        @update="e => router.push({name: 'OrdersUpdate', params: {id: e}})"
        @delete="e => router.push({name: 'OrdersDelete', params: {id: e}})"
        @addBlank="e => router.push({name: 'OrdersAddBlank', params: {id: e}})"
        @openBlank="openBlank"
        @sendMessage="sendTelegramMessage"
        @addTrack="e => router.push({name: 'OrdersAddTrack', params: {id: e}})"
        @return="e => router.push({name: 'OrdersReturn', params: {id: e}})"
        @send="e => router.push({name: 'OrdersSend', params: {id: e}})"
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
    <u-popup
        v-if="route.name === 'OrdersCreate' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length"
        title="Добавление заказа"
        @close="router.push({name: 'Orders'})"
    >
      <u-form
          text="Добавить заказ"
          @submit.prevent="submitCreateOrders()"
          v-if="loading"
      >
        <div class="list">
          <u-input
              title="Трек-номер"
              v-model="order.track.value.value"
              :start-value="order.track.value.value"
              :error="order.track.value.error"
              @blur="order.track.value.tacked = true"
              @change="order.track.value.tacked = true"
          />
          <u-input
              title="ФИО"
              v-model="order.client.value.value"
              :start-value="order.client.value.value"
              :error="order.client.value.error"
              @blur="order.client.value.tacked = true"
              @input="() => {
              order.client.value.tacked = true
              findClients()
            }"
              @change="order.client.value.tacked = true"
          />
          <u-card class="orders__clients-list" v-if="getClientsList.length">
            <p class="sub-title">Список найденных клиентов</p>
            <u-card
                v-for="client in getClientsList"
                class="orders__clients-item"
                :key="`client-item-${client.id}`"
            >
              <p class="text">
                <b>ФИО:</b> {{ client.full_name }}
              </p>
              <p class="text">
                <b>Телефон:</b> {{ client.phone }}
              </p>
              <p class="text">
                <b>E-mail:</b> {{ client.email }}
              </p>
              <div class="list">
                <u-button
                    v-for="address in client.address"
                    type="button"
                    @click="selectClient(client.id, address.id)"
                    :key="`client-address-${address.id}`"
                    class="orders__address-button"
                >
                  {{ address.delivery }} {{ address.address }}
                </u-button>
              </div>
            </u-card>
          </u-card>
          <u-input
              title="Адрес"
              v-model="order.address.value.value"
              :start-value="order.address.value.value"
              :error="order.address.value.error"
              @blur="order.address.value.tacked = true"
              @change="order.address.value.tacked = true"
          />
          <u-input
              title="Телефон"
              v-model="order.phone.value.value"
              :start-value="order.phone.value.value"
              :error="order.phone.value.error"
              @blur="order.phone.value.tacked = true"
              @change="order.phone.value.tacked = true"
          />
          <u-input
              title="E-mail"
              v-model="order.email.value.value"
              :start-value="order.email.value.value"
          />
          <u-input
              title="Комментарий"
              v-model="order.comment.value.value"
              :start-value="order.comment.value.value"
              type="textarea"
          />

          <u-select
              title="Доставка"
              :values="filterDelivery.filter(delivery => delivery.value).filter(delivery => delivery.value !== 'Boxberry')"
              v-model="order.delivery.value.value"
              :start-value="order.delivery.value.value"
              :error="order.delivery.value.error"
              @blur="order.delivery.value.tacked = true"
              @change="order.delivery.value.tacked = true"
              class="orders__select orders__select--delivery"
          />
          <u-input
              v-if="order.delivery.value.value === 'Почта России' || order.delivery.value.value === 'Яндекс Доставка'"
              title="Бланк"
              type="file"
              @file="e => order.file.value.value = e"
              class="orders__input orders__input--file"
          />
          <u-card>
            <p class="sub-title">Состав заказа</p>
            <u-card
                v-for="(item, id) in order.composition.value"
                :key="`good-order-item${item.id}`"
                :class="['orders__form-item', {'orders__form-item--division': order.composition.value.length > 1}]"
                :style="[{'--z-index': order.composition.value.length - id}]"
            >
              <u-select
                  title="Тип"
                  :values="compositionTypes"
                  :start-value="item.type.value"
                  :error="item.type.error"
                  v-model="item.type.value"
                  @change="() => {
                    item.type.tacked = true
                    item.good.value = ''
                    item.product.value = ''
                    item.present = false
                  }"
                  class="orders__select orders__select--type"
              />
              <template v-if="item.type.value === 'good'">
                <u-select
                    title="Продукт"
                    :values="computedProducts"
                    :start-value="item.product.value"
                    :error="item.product.error"
                    v-model="item.product.value"
                    @change="() => {
                    item.product.tacked = true
                    item.good.value = ''
                  }"
                    class="orders__select orders__select--product"
                />
                <u-select
                    v-if="item.product.value"
                    title="Товар"
                    :values="computedGoods.filter(good =>  good.product === item.product.value)"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
                    class="orders__select orders__select--good"
                />
                <u-input
                    title="Количество"
                    type="number"
                    :start-value="item.quantity.value"
                    :error="item.quantity.error"
                    v-model="item.quantity.value"
                    @change="item.quantity.tacked = true"
                    @blur="item.quantity.tacked = true"
                />
                <u-checkbox
                    class="orders__present"
                    title="Подарок"
                    name="present"
                    value="1"
                    :checked="item.present"
                    @checked="item.present = !item.present"
                />
              </template>
              <template v-else-if="item.type.value === 'kit'">
                <u-select
                    title="Товар"
                    :values="computedKits"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
                    class="orders__select orders__select--good"
                />
                <u-input
                    title="Количество"
                    type="number"
                    :start-value="item.quantity.value"
                    :error="item.quantity.error"
                    v-model="item.quantity.value"
                    @change="item.quantity.tacked = true"
                    @blur="item.quantity.tacked = true"
                />
              </template>
              <template v-else-if="item.type.value === 'present'">
                <u-select
                    title="Товар"
                    :values="computedPresents"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="() => {
                    item.good.tacked = true
                    item.present = true
                    item.quantity.value = 1

                  }"
                    class="orders__select orders__select--good"
                />
              </template>
              <u-button
                  v-if="order.composition.value.length > 1"
                  type="button"
                  modifier="red"
                  class="orders__delete-order"
                  @click="removeComposition(item.id)"
              />
            </u-card>
            <u-button
                type="button"
                @click="addComposition()"
                class="orders__add-order"
            >
              Добавить товар
            </u-button>
          </u-card>
          <u-checkbox
              class="orders__present"
              title="Заказ оплачен"
              name="payed"
              value="1"
              :checked="order.payed.value"
              @checked="order.payed.value = !order.payed.value"
          />
        </div>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'OrdersUpdate' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && loading"
        title="Изменение заказа"
        @close="router.push({name: 'Orders'})"
    >
      <u-form
          text="Изменить заказ"
          @submit.prevent="submitUpdateOrders()"
          v-if="loading"
      >
        <div class="list">
          <u-input
              title="Трек-номер"
              v-model="order.track.value.value"
              :start-value="order.track.value.value"
              :error="order.track.value.error"
              @blur="order.track.value.tacked = true"
              @change="order.track.value.tacked = true"
          />
          <u-input
              title="ФИО"
              v-model="order.client.value.value"
              :start-value="order.client.value.value"
              disabled
          />
          <u-card class="orders__clients-list" v-if="getClientsList.length">
            <p class="sub-title">Список найденных клиентов</p>
            <u-card
                v-for="client in getClientsList"
                class="orders__clients-item"
                :key="`client-item-${client.id}`"
            >
              <p class="text">
                <b>ФИО:</b> {{ client.full_name }}
              </p>
              <p class="text">
                <b>Телефон:</b> {{ client.phone }}
              </p>
              <p class="text">
                <b>E-mail:</b> {{ client.email }}
              </p>
              <div class="orders__address-list">
                <u-button
                    v-for="address in client.address"
                    type="button"
                    @click="selectClient(client.id, address.id)"
                    :key="`client-address-${address.id}`"
                    class="orders__address-button"
                >
                  {{ address.delivery }} {{ address.address }}
                </u-button>
              </div>
            </u-card>
          </u-card>
          <u-input
              title="Адрес"
              v-model="order.address.value.value"
              :start-value="order.address.value.value"
              :error="order.address.value.error"
              @blur="order.address.value.tacked = true"
              @change="order.address.value.tacked = true"
          />
          <u-input
              title="Телефон"
              v-model="order.phone.value.value"
              :start-value="order.phone.value.value"
              :error="order.phone.value.error"
              @blur="order.phone.value.tacked = true"
              @change="order.phone.value.tacked = true"
          />
          <u-input
              title="E-mail"
              v-model="order.email.value.value"
              :start-value="order.email.value.value"
          />
          <u-input
              title="Комментарий"
              v-model="order.comment.value.value"
              :start-value="order.comment.value.value"
              type="textarea"
          />

          <u-select
              title="Доставка"
              :values="filterDelivery.filter(delivery => delivery.value).filter(delivery => delivery.value !== 'Boxberry')"
              v-model="order.delivery.value.value"
              :start-value="order.delivery.value.value"
              :error="order.delivery.value.error"
              @blur="order.delivery.value.tacked = true"
              @change="order.delivery.value.tacked = true"
              class="orders__select orders__select--delivery"
          />
          <u-input
              v-if="order.delivery.value.value === 'Почта России' || order.delivery.value.value === 'Яндекс Доставка'"
              title="Бланк"
              type="file"
              @file="e => order.file.value.value = e"
              class="orders__input orders__input--file"
          />
          <u-card>
            <p class="sub-title">Состав заказа</p>
            <u-card
                v-for="(item, id) in order.composition.value"
                :key="`good-order-item${item.id}`"
                :class="['orders__form-item', {'orders__form-item--division': order.composition.value.length > 1}]"
                :style="[{'--z-index': order.composition.value.length - id}]"
            >
              <u-select
                  title="Тип"
                  :values="compositionTypes"
                  :start-value="item.type.value"
                  :error="item.type.error"
                  v-model="item.type.value"
                  @change="() => {
                    item.type.tacked = true
                    item.good.value = ''
                    item.product.value = ''
                    item.present = false
                  }"
                  class="orders__select orders__select--type"
              />
              <template v-if="item.type.value === 'good'">
                <u-select
                    title="Продукт"
                    :values="computedProducts"
                    :start-value="item.product.value"
                    :error="item.product.error"
                    v-model="item.product.value"
                    @change="() => {
                    item.product.tacked = true
                    item.good.value = ''
                  }"
                    class="orders__select orders__select--product"
                />
                <u-select
                    v-if="item.product.value"
                    title="Товар"
                    :values="computedGoods.filter(good =>  good.product === item.product.value)"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
                    class="orders__select orders__select--good"
                />
                <u-input
                    title="Количество"
                    type="number"
                    :start-value="item.quantity.value"
                    :error="item.quantity.error"
                    v-model="item.quantity.value"
                    @change="item.quantity.tacked = true"
                    @blur="item.quantity.tacked = true"
                />
              </template>
              <template v-else-if="item.type.value === 'kit'">
                <u-select
                    title="Товар"
                    :values="computedKits"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
                    class="orders__select orders__select--good"
                />
                <u-input
                    title="Количество"
                    type="number"
                    :start-value="item.quantity.value"
                    :error="item.quantity.error"
                    v-model="item.quantity.value"
                    @change="item.quantity.tacked = true"
                    @blur="item.quantity.tacked = true"
                />
              </template>
              <template v-else-if="item.type.value === 'present'">
                <u-select
                    title="Товар"
                    :values="computedPresents"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="() => {
                    item.good.tacked = true
                    item.present = true
                    item.quantity.value = 1

                  }"
                    class="orders__select orders__select--good"
                />
              </template>
              <u-button
                  v-if="order.composition.value.length > 1"
                  type="button"
                  modifier="red"
                  class="orders__delete-order"
                  @click="removeComposition(item.id)"
              />
            </u-card>
            <u-button
                type="button"
                @click="addComposition()"
                class="orders__add-order"
            >
              Добавить товар
            </u-button>
          </u-card>
          <u-checkbox
              class="orders__present"
              title="Заказ оплачен"
              name="payed"
              value="1"
              :checked="order.payed.value"
              @checked="order.payed.value = !order.payed.value"
          />
        </div>
      </u-form>
    </u-popup>
    <u-alert
        v-if="route.name === 'OrdersDelete' && route.params.id"
        title="Удалить заказ?"
        type="confirm"
        @close="router.push({name: 'Orders', params: {status: route.params.status}})"
        @accept="submitDeleteOrders()"
    />
    <u-alert
        v-if="route.name === 'OrdersReturn' && route.params.id"
        title="Вернуть заказ?"
        type="confirm"
        @close="router.push({name: 'Orders', params: {status: route.params.status}})"
        @accept="submitReturnOrders()"
    />
    <u-alert
        v-if="route.name === 'OrdersSend' && route.params.id"
        title="Отправить заказ?"
        type="confirm"
        @close="router.push({name: 'Orders', params: {status: route.params.status}})"
        @accept="submitSendOrders()"
    />
    <u-popup
        title="Добавление трек-номера"
        v-if="route.name === 'OrdersAddTrack' && getOrderDetail"
        @close="router.push({name: 'Orders'})"
    >
      <u-form
          text="Добавить трек-номер"
          @submit.prevent="submitAddTrack()"
      >
        <p class="sub-title" @click="copyNumber(getOrderDetail.number)"><b>Номер заказа: </b>{{ getOrderDetail.number }} </p>
        <p class="text"><b>ФИО: </b>{{ getOrderDetail.client.full_name }} </p>
        <div class="list">
          <u-input
              title="Трек-номер"
              v-model="order.track.value.value"
              :start-value="order.track.value.value"
              :error="order.track.value.error"
              @blur="order.track.value.tacked = true"
              @change="order.track.value.tacked = true"
          />
          <u-input
              v-if="getOrderDetail.address.delivery !== 'CDEK'"
              title="Бланк"
              type="file"
              @file="e => order.file.value.value = e"
              class="orders__input orders__input--file"
              :error="order.file.value.error"
          />
        </div>
      </u-form>
    </u-popup>
    <u-popup
        title="Добавление бланка"
        v-if="route.name === 'OrdersAddBlank' && getOrderDetail"
        @close="router.push({name: 'Orders'})"
    >
      <u-form
          text="Добавить бланк"
          @submit.prevent="submitAddBlank()"
      >
        <p class="sub-title"><b>Трек-номер: </b>{{ getOrderDetail.track }} </p>
        <p class="sub-title" @click="copyNumber(getOrderDetail.number)"><b>Номер заказа: </b>{{ getOrderDetail.number }} </p>
        <p class="text"><b>ФИО: </b>{{ getOrderDetail.client.full_name }} </p>
        <div class="list">
          <u-input
              title="Бланк"
              type="file"
              @file="e => order.file.value.value = e"
              class="orders__input orders__input--file"
              :error="order.file.value.error"
          />
        </div>
      </u-form>
    </u-popup>
    <orders-preview
        v-if="route.name === 'OrdersPreview' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-detail-orders-composition="computedDetailOrdersComposition"
        :computed-status="computedStatus"
        :order="getOrderDetail"
        openCollect
        @close="router.push({name: 'Orders'})"
        @collect="router.push({name: 'OrdersCollect', params: {id: getOrderDetail.id}})"
    />
    <orders-send
        v-if="route.name === 'OrdersSendSeveral' && getOrders.length"
        :tacked-orders="tackedOrders"
        :orders="getOrders.filter(item => +item.status !== 6)"
        @submit="submitSendOrders()"
        @close="router.push({name: 'Orders'})"
        @takeOrder="e=> !!tackedOrders.find(item => +item === +e.id) ? tackedOrders = tackedOrders.filter(item => +item !== +e.id) : tackedOrders.push(e.id)"
        @takeAll="tackedOrders = tackedOrders.length === getOrders.filter(item => +item.status !== 6).length ? [] : getOrders.filter(item => +item.status !== 6).map(item => item.id)"
    />
    <orders-collect
        v-if="route.name === 'OrdersCollect' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :collect-goods="collectGoods"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-boxes-list="computedBoxesList"
        :order="getOrderDetail"
        :boxes="order.boxes"
        @addBox="addBox()"
        @removeBox="e=>removeBox(e)"
        @submit="submitCollectOrders()"
        @close="router.push({name: 'Orders'})"
        @collectGoods="e => !!collectGoods.find(item => +item === +e.id) ? collectGoods = collectGoods.filter(item => +item !== +e.id) : collectGoods.push(e.id)"
    />
  </div>
</template>

<style lang="scss" src="./Orders.scss" scoped/>