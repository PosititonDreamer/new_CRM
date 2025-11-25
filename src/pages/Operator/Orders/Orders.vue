<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {HookOrders} from "@/hooks/pages/Orders/index.js";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import OrdersList from "@/components/OrdersList/OrdersList.vue";
import {Orders} from "@/store/Orders/Orders.js";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import {ref, watch} from "vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import OrdersPreview from "@/components/OrdersPreview/OrdersPreview.vue";

export default {
  name: "OperatorOrders",
  components: {OrdersPreview, UAlert, UPopup, UCheckbox, UForm, UCard, OrdersList, USelect, UInput, UButton},
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
      filter,
      filterDelivery,
      filterSort,
      changeFilter,
      getOrders,
      actionsOrders,
      sendTelegramMessage,
      copyTrack,
      getNextPage,
      findNextPage,
      compositionTypes,
      computedProducts,
      computedGoods,
      computedKits,
      computedPresents,
      removeComposition,
      addComposition,
      order,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      submitCreateOrders,
      submitUpdateOrders,
      submitDeleteOrders,
      submitReturnOrders,
      getOrderDetail,
      submitAddTrack,
      copyNumber,
      computedDetailOrdersGoods,
      computedDetailOrdersComposition,
      computedStatus,
      submitAddBlank,
      clearData,
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
      if (to.name === 'OperatorOrders') {
        clearData()
        return
      }

      if (to.name === 'OperatorOrdersCreate' || to.name === 'OperatorOrdersUpdate' || to.name === 'OperatorOrdersPreview' || to.name === 'OperatorOrdersAddTrack' || to.name === 'OperatorOrdersAddBlank') {
        await findGoodsList()
        if (to.name !== 'OperatorOrdersCreate') {
          await findOrdersDetail()
        } else {
          addComposition()
        }
      }

      if (to.name === 'OperatorOrdersUpdate') {
        loading.value = false
        if (getOrderDetail.value) {
          order.comment.value.value = getOrderDetail.value.comment
          order.track.value.value = getOrderDetail.value.track
          order.client.value.value = getOrderDetail.value.client.full_name
          order.phone.value.value = getOrderDetail.value.client.phone
          order.email.value.value = getOrderDetail.value.client.email
          order.address.value.value = getOrderDetail.value.address.address
          order.delivery.value.value = getOrderDetail.value.address.delivery
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
      router,
      route,
      filter,
      filterDelivery,
      filterSort,
      changeFilter,
      getOrders,
      actionsOrders,
      sendTelegramMessage,
      copyTrack,
      getNextPage,
      findNextPage,
      loading,
      compositionTypes,
      computedProducts,
      computedGoods,
      computedKits,
      computedPresents,
      removeComposition,
      addComposition,
      order,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      submitCreateOrders,
      getClientsList,
      submitUpdateOrders,
      submitDeleteOrders,
      submitReturnOrders,
      getOrderDetail,
      submitAddTrack,
      copyNumber,
      computedDetailOrdersGoods,
      computedDetailOrdersComposition,
      computedStatus,
      submitAddBlank,
      selectClient,
      findClients
    }
  }
}
</script>

<template>
  <div class="orders">
    <u-button
        v-if="+route.params.status === 1"
        class="orders__create"
        @click="router.push({name: 'OperatorOrdersCreate'})"
    >
      Добавить заказ
    </u-button>
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
        @preview="e => router.push({name: 'OperatorOrdersPreview', params: {id: e}})"
        @update="e => router.push({name: 'OperatorOrdersUpdate', params: {id: e}})"
        @delete="e => router.push({name: 'OperatorOrdersDelete', params: {id: e}})"
        @addBlank="e => router.push({name: 'OperatorOrdersAddBlank', params: {id: e}})"
        @sendMessage="sendTelegramMessage"
        @addTrack="e => router.push({name: 'OperatorOrdersAddTrack', params: {id: e}})"
        @return="e => router.push({name: 'OperatorOrdersReturn', params: {id: e}})"
        @copyTrack="e => copyTrack(e)"
    />
    <u-button
        class="orders__find"
        v-if="getNextPage"
        @click="findNextPage"
    >
      Загрузить еще
    </u-button>
    <u-popup
        v-if="route.name === 'OperatorOrdersCreate' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length"
        title="Добавление заказа"
        @close="router.push({name: 'OperatorOrders'})"
    >
      <u-form
          text="Добавить заказ"
          @submit.prevent="submitCreateOrders('OperatorOrders')"
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
        v-if="route.name === 'OperatorOrdersUpdate' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && loading"
        title="Изменение заказа"
        @close="router.push({name: 'OperatorOrders'})"
    >
      <u-form
          text="Изменить заказ"
          @submit.prevent="submitUpdateOrders('OperatorOrders')"
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
        v-if="route.name === 'OperatorOrdersDelete' && route.params.id"
        title="Удалить заказ?"
        type="confirm"
        @close="router.push({name: 'OperatorOrders', params: {status: route.params.status}})"
        @accept="submitDeleteOrders('OperatorOrders')"
    />
    <u-alert
        v-if="route.name === 'OperatorOrdersReturn' && route.params.id"
        title="Вернуть заказ?"
        type="confirm"
        @close="router.push({name: 'OperatorOrders', params: {status: route.params.status}})"
        @accept="submitReturnOrders('OperatorOrders')"
    />
    <u-popup
        title="Добавление трек-номера"
        v-if="route.name === 'OperatorOrdersAddTrack' && getOrderDetail"
        @close="router.push({name: 'OperatorOrders'})"
    >
      <u-form
          text="Добавить трек-номер"
          @submit.prevent="submitAddTrack('OperatorOrders')"
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
        v-if="route.name === 'OperatorOrdersAddBlank' && getOrderDetail"
        @close="router.push({name: 'OperatorOrders'})"
    >
      <u-form
          text="Добавить бланк"
          @submit.prevent="submitAddBlank('OperatorOrders')"
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
        v-if="route.name === 'OperatorOrdersPreview' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-detail-orders-composition="computedDetailOrdersComposition"
        :computed-status="computedStatus"
        :order="getOrderDetail"
        @close="router.push({name: 'OperatorOrders'})"
    />
  </div>
</template>
<style lang="scss" src="./Orders.scss" scoped />