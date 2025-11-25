<script>
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import {HookClients} from "@/hooks/pages/Clients/index.js";
import {Clients} from "@/store/Clients/Clients.js";
import {ref, watch} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import OrdersList from "@/components/OrdersList/OrdersList.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {Orders} from "@/store/Orders/Orders.js";
import {HookOrders} from "@/hooks/pages/Orders/index.js";
import OrdersPreview from "@/components/OrdersPreview/OrdersPreview.vue";

export default {
  name: 'Clients',
  components: {OrdersPreview, UButton, UInput, UForm, UPopup, UActions, OrdersList, UAccordion, UCard, USelect},

  setup() {
    const {
      getClients,
      getClientsFullNameList,
      filter,
      joinClientsList,
      joinAddressList,
      client,
      full_name,
      address,
      router,
      route,
      findNextPage,
      submitFindClientsList,
      submitFindClientsFullNameList,
      submitJoinClients,
      submitJoinAddress,
      filterSort,
      changeFilter,
      actionsOrders,
      actionsClients,
      phone,
      email,
      name,
      submitUpdateClients,
      clearData,
      getNextPage,
      computedAddress
    } = HookClients()

    const {
      findClients,
      findClientId
    } = Clients()

    const {findOrdersDetail, findGoodsList} = Orders()
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

    const loading = ref(true)

    findClients({...filter.value})

    const changeRoute = async (to) => {
      if (to.name === 'Clients') {
        clearData()
        return
      }

      if (to.name === 'ClientsUpdate' || to.name === 'ClientsJoin' || to.name === 'ClientsJoinAddress') {
        loading.value = false
        if (!getClients.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findClient = getClients.value.find(client => +client.id === +route.params.client)
        if (!findClient) {
          await findClientId(route.params.client)
          changeRoute(to)
          return
        }
        email.value.value = findClient.email
        name.value.value = findClient.full_name
        phone.value.value = findClient.phone

        email.value.tacked = true
        name.value.tacked = true
        phone.value.tacked = true

        setTimeout(() => {
          loading.value = true
        })
      }

      if (to.name === 'ClientsPreviewOrder') {
        await findOrdersDetail()
        await findGoodsList()
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      getClients,
      getClientsFullNameList,
      filter,
      joinClientsList,
      joinAddressList,
      client,
      full_name,
      address,
      router,
      route,
      findNextPage,
      submitFindClientsList,
      submitFindClientsFullNameList,
      submitJoinClients,
      submitJoinAddress,
      filterSort,
      changeFilter,
      actionsOrders,
      actionsClients,
      phone,
      email,
      name,
      submitUpdateClients,
      loading,
      getNextPage,
      getGoodsList,
      getProductsList,
      getKitsList,
      getPresentsList,
      getOrderDetail,
      computedDetailOrdersGoods,
      computedDetailOrdersComposition,
      computedStatus,
      computedAddress
    }
  }
}
</script>

<template>
  <div class="clients">
    <div class="clients__filters">
      <u-select
          title="Сортировка"
          :values="filterSort"
          v-model="filter.sort"
          :start-value="filter.sort"
          :empty="false"
          @update="changeFilter"
      />
    </div>
    <div class="clients__list list" v-if="getClients.length">
      <u-card class="clients__item" v-for="clientItem in getClients" :key="`client-item-${clientItem.id}`">
        <p class="sub-title">{{ clientItem.full_name }}</p>
        <p class="text">
          <b>E-mail: </b> {{ clientItem.email }}
        </p>
        <p class="text">
          <b>Телефон: </b> {{ clientItem.phone }}
        </p>
        <div class="list">
          <u-card>
            <u-accordion
                title="Адреса клиента"
            >
              <div class="list">
                <u-card class="clients__address" v-for="addressItem in clientItem.address">
                  <p class="text">
                    <b>Служба доставки: </b> {{ addressItem.delivery }}
                  </p>
                  <p class="text">
                    <b>Адрес доставки: </b> {{ addressItem.address }}
                  </p>
                </u-card>
              </div>
            </u-accordion>
          </u-card>
          <u-card class="clients__orders-list">
            <u-accordion
                title="Заказы"
            >
              <orders-list
                  :orders="clientItem.orders"
                  :actions="actionsOrders"
                  :check-blank="false"
                  @preview="e => router.push({name: 'ClientsPreviewOrder', params: {id: e}})"
              />
            </u-accordion>
          </u-card>
        </div>
        <u-actions
            class="clients__actions"
            :actions="actionsClients"
            @update="router.push({name: 'ClientsUpdate', params: {client: clientItem.id}})"
            @joinClients="router.push({name: 'ClientsJoin', params: {client: clientItem.id}})"
            @joinAddress="router.push({name: 'ClientsJoinAddress', params: {client: clientItem.id}})"
        />
      </u-card>
      <u-button
          class="orders__find"
          v-if="getNextPage"
          @click="findNextPage"
      >
        Загрузить еще
      </u-button>
    </div>
    <u-popup
        v-if="loading && route.name === 'ClientsUpdate' && route.params.client"
        title="Изменение клиента"
        @close="router.push({name: 'Clients'})"
    >
      <u-form
          text="Изменить клиента"
          @submit.prevent="submitUpdateClients('Clients')"
      >
        <div class="list">
          <u-input
              title="ФИО"
              v-model="name.value"
              :start-value="name.value"
              :error="name.error"
              @change="name.tacked = true"
              @blur="name.tacked = true"
          />
          <u-input
              title="Телефон"
              v-model="phone.value"
              :start-value="phone.value"
              :error="phone.error"
              @change="phone.tacked = true"
              @blur="phone.tacked = true"
          />
          <u-input
              title="E-mail"
              v-model="email.value"
              :start-value="email.value"
              :error="email.error"
              @change="email.tacked = true"
              @blur="email.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
    <u-popup
        v-if="loading && route.name === 'ClientsJoin' && route.params.client"
        title="Объединение клиентов"
        @close="router.push({name: 'Clients'})"
    >
      <u-form
          text="Объдинить клиентов"
          @submit.prevent="submitJoinClients('Clients')"
      >
        <p class="text">
          <b>ФИО: </b>{{ name.value }}
        </p>
        <p class="text">
          <b>E-mail: </b> {{ email.value }}
        </p>
        <p class="text">
          <b>Телефон: </b> {{ phone.value }}
        </p>
        <div class="list">
          <u-input
              title="Поиск клиентов"
              v-model="full_name.value"
              :start-value="full_name.value"
              @blur="full_name.tacked = true"
              @input="() => {
              full_name.tacked = true
              submitFindClientsFullNameList()
            }"
              @change="full_name.tacked = true"
          />
          <u-card class="clients__clients-list">
            <p class="sub-title">Список найденных клиентов</p>
            <u-button
                v-for="client in getClientsFullNameList.filter(item => +item.id !== +route.params.client).filter(item => !joinClientsList.find(child => +child.id === +item.id))"
                type="button"
                @click="joinClientsList.push(client)"
                :key="`client-address-${address.id}`"
                class="clients__select-button"
            >
              {{ client.full_name }} {{ client.phone }} {{ client.email }}
            </u-button>
          </u-card>
          <u-card class="clients__join-list">
            <p class="sub-title">Список клиентов для объединения</p>
            <u-card class="clients__join-item" v-for="client in joinClientsList" :key="`client-join-${client.id}`">
              <p>{{ client.full_name }}</p>
              <u-button
                  type="button"
                  modifier="red"
                  class="clients__delete-client"
                  @click="joinClientsList = joinClientsList.filter(item => +item.id !== +client.id)"
              />
            </u-card>
            <p
                class="text text--few-very text--bold"
                v-if="joinClientsList.length === 0"
            >
              Должен быть выбран хотя бы 1 клиент
            </p>
          </u-card>
        </div>
      </u-form>
    </u-popup>
    <u-popup
        v-if="loading && route.name === 'ClientsJoinAddress' && route.params.client"
        title="Объединение адресов клиента"
        @close="router.push({name: 'Clients'})"
    >
      <u-form
          text="Объединить адреса"
          @submit.prevent="submitJoinAddress('Clients')"
      >
        <p class="text">
          <b>ФИО: </b>{{ name.value }}
        </p>
        <p class="text">
          <b>E-mail: </b> {{ email.value }}
        </p>
        <p class="text">
          <b>Телефон: </b> {{ phone.value }}
        </p>
        <div class="list">
          <u-select
              title="Адрес, с которым объединить"
              v-model="address.value"
              :start-value="address.value"
              :error="address.error"
              @change="address.tacked = true"
              :values="computedAddress"
              class="clients__select"
          />

          <u-select
              title="Адрес для объединения"
              :values="computedAddress.filter(item => +item.value !== +address.value).filter(item => !joinAddressList.find(child => +child.id === +item.value))"
              @select="e => {
              joinAddressList.push(computedAddress.find(item => +item.value === +e).item)
            }"
              class="clients__select clients__select--two"
          />

          <u-card class="clients__join-list">
            <p class="sub-title">Список адресов для объединения</p>
            <u-card class="clients__join-item" v-for="join in joinAddressList" :key="`client-join-${join.id}`">
              <p>{{ join.address }} {{ join.delivery }}</p>
              <u-button
                  type="button"
                  modifier="red"
                  class="clients__delete-client"
                  @click="joinAddressList = joinAddressList.filter(item => +item.id !== +join.item.id)"
              />
            </u-card>
            <p
                class="text text--few-very text--bold"
                v-if="joinAddressList.length === 0"
            >
              Должен быть выбран хотя бы 1 адрес
            </p>
          </u-card>
        </div>
      </u-form>
    </u-popup>
    <orders-preview
        v-if="route.name === 'ClientsPreviewOrder' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-detail-orders-composition="computedDetailOrdersComposition"
        :computed-status="computedStatus"
        :order="getOrderDetail"
        @close="router.push({name: 'Clients'})"
    />
  </div>
</template>

<style lang="scss" src="./Clients.scss" scoped/>