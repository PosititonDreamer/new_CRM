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
  beforeCreate() {
    const {clearClients} = Clients()

    clearClients()
  },
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
      computedAddress,
    } = HookClients()

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

    const changeRoute = async (to) => {
      if (to.name === 'ClientsFind') {
        clearData()
        return
      }

      if (to.name === 'ClientsFindUpdate' || to.name === 'ClientsFindJoin' || to.name === 'ClientsFindJoinAddress') {
        loading.value = false
        const findClient = getClients.value.find(client => +client.id === +route.params.client)
        if (!findClient) {
          router.push({name: 'ClientsUpdate', params: {client: route.params.client}})
        }
        email.value.value = findClient.email
        name.value.value = findClient.full_name
        phone.value.value = findClient.phone ? findClient.phone : ""

        email.value.tacked = true
        name.value.tacked = true
        phone.value.tacked = true

        setTimeout(() => {
          loading.value = true
        })
      }

      if (to.name === 'ClientsFindPreviewOrder') {
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
  <div class="clients-find">
    <u-button
        class="clients-find__setting"
        @click="router.push({name: 'ClientsFindSetting'})"
    >
      Настройка поиска
    </u-button>
    <div class="clients-find__list" v-if="getClients.length">
      <u-card class="clients-find__item" v-for="clientItem in getClients" :key="`client-item-${clientItem.id}`">
        <p class="clients-find__title">{{ clientItem.full_name }}</p>
        <p class="clients-find__text">
          <b>E-mail: </b> {{ clientItem.email }}
        </p>
        <p class="clients-find__text">
          <b>Телефон: </b> {{ clientItem.phone }}
        </p>
        <u-card class="clients-find__address-list">
          <u-accordion
              title="Адреса клиента"
          >
            <u-card class="clients-find__address" v-for="addressItem in clientItem.address">
              <p class="clients-find__text">
                <b>Служба доставки: </b> {{ addressItem.delivery }}
              </p>
              <p class="clients-find__text">
                <b>Адрес доставки: </b> {{ addressItem.address }}
              </p>
            </u-card>
          </u-accordion>
        </u-card>
        <u-card class="clients-find__orders-list">
          <u-accordion
              title="Заказы"
          >
            <orders-list
                :orders="clientItem.orders"
                :actions="actionsOrders"
                :check-blank="false"
                @preview="e => router.push({name: 'ClientsFindPreviewOrder', params: {id: e}})"
            />
          </u-accordion>
        </u-card>
        <u-actions
            class="clients-find__actions"
            :actions="actionsClients"
            @update="router.push({name: 'ClientsFindUpdate', params: {client: clientItem.id}})"
            @joinClients="router.push({name: 'ClientsFindJoin', params: {client: clientItem.id}})"
            @joinAddress="router.push({name: 'ClientsFindJoinAddress', params: {client: clientItem.id}})"
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
        v-if="route.name === 'ClientsFindSetting'"
        title="Настройка поиска"
        @close="router.push({name: 'ClientsFind'})"
    >
      <u-form
          text="Найти клиентов"
          @submit.prevent="submitFindClientsList('ClientsFind')"
      >
        <u-input
            title="ФИО"
            v-model="client.value"
            :start-value="client.value"
            :error="client.error"
            @change="client.tacked = true"
            @blur="client.tacked = true"
        />
      </u-form>
    </u-popup>
    <u-popup
        v-if="loading && route.name === 'ClientsFindUpdate' && route.params.client"
        title="Изменение клиента"
        @close="router.push({name: 'ClientsFind'})"
    >
      <u-form
          text="Изменить клиента"
          @submit.prevent="submitUpdateClients('ClientsFind')"
      >
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
      </u-form>
    </u-popup>
    <u-popup
        v-if="loading && route.name === 'ClientsFindJoin' && route.params.client"
        title="Объединение клиентов"
        @close="router.push({name: 'ClientsFind'})"
    >
      <u-form
          text="Объдинить клиентов"
          @submit.prevent="submitJoinClients('ClientsFind')"
      >
        <p class="clients-find__text">
          <b>ФИО: </b>{{ name.value }}
        </p>
        <p class="clients-find__text">
          <b>E-mail: </b> {{ email.value }}
        </p>
        <p class="clients-find__text">
          <b>Телефон: </b> {{ phone.value }}
        </p>

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
        <u-card class="clients-find__clients-list">
          <p class="clients-find__title">Список найденных клиентов</p>
          <u-button
              v-for="client in getClientsFullNameList.filter(item => +item.id !== +route.params.client).filter(item => !joinClientsList.find(child => +child.id === +item.id))"
              type="button"
              @click="joinClientsList.push(client)"
              :key="`client-address-${address.id}`"
              class="clients-find__select-button"
          >
            {{ client.full_name }} {{ client.phone }} {{ client.email }}
          </u-button>
        </u-card>
        <u-card class="clients-find__join-list">
          <p class="clients-find__title">Список клиентов для объединения</p>
          <u-card class="clients-find__join-item" v-for="client in joinClientsList" :key="`client-join-${client.id}`">
            <p>{{ client.full_name }}</p>
            <u-button
                type="button"
                modifier="red"
                class="clients-find__delete-client"
                @click="joinClientsList = joinClientsList.filter(item => +item.id !== +client.id)"
            />
          </u-card>
          <p
              class="clients-find__alarm"
              v-if="joinClientsList.length === 0"
          >
            Должен быть выбран хотя бы 1 клиент
          </p>
        </u-card>
      </u-form>
    </u-popup>
    <u-popup
        v-if="loading && route.name === 'ClientsFindJoinAddress' && route.params.client"
        title="Объединение адресов клиента"
        @close="router.push({name: 'ClientsFind'})"
    >
      <u-form
          text="Объдинить адреса"
          @submit.prevent="submitJoinAddress('ClientsFind')"
      >
        <p class="clients-find__text">
          <b>ФИО: </b>{{ name.value }}
        </p>
        <p class="clients-find__text">
          <b>E-mail: </b> {{ email.value }}
        </p>
        <p class="clients-find__text">
          <b>Телефон: </b> {{ phone.value }}
        </p>

        <u-select
            title="Адрес, с которым объединить"
            v-model="address.value"
            :start-value="address.value"
            :error="address.error"
            @change="address.tacked = true"
            :values="computedAddress"
            class="clients-find__select"
        />

        <u-select
            title="Адрес для объединения"
            :values="computedAddress.filter(item => +item.value !== +address.value).filter(item => !joinAddressList.find(child => +child.id === +item.value))"
            @select="e => {
              joinAddressList.push(computedAddress.find(item => +item.value === +e).item)
            }"
            class="clients-find__select clients-find__select--two"
        />

        <u-card class="clients-find__join-list">
          <p class="clients-find__title">Список клиентов для объединения</p>
          <u-card class="clients-find__join-item" v-for="join in joinAddressList" :key="`client-join-${join.id}`">
            <p>{{ join.address }} {{ join.delivery }}</p>
            <u-button
                type="button"
                modifier="red"
                class="clients-find__delete-client"
                @click="joinAddressList = joinAddressList.filter(item => +item.id !== +join.item.id)"
            />
          </u-card>
          <p
              class="clients-find__alarm"
              v-if="joinAddressList.length === 0"
          >
            Должен быть выбран хотя бы 1 адрес
          </p>
        </u-card>
      </u-form>
    </u-popup>
    <orders-preview
        v-if="route.name === 'ClientsFindPreviewOrder' && getGoodsList.length && getProductsList.length && getKitsList.length && getPresentsList.length && getOrderDetail"
        :computed-detail-orders-goods="computedDetailOrdersGoods"
        :computed-detail-orders-composition="computedDetailOrdersComposition"
        :computed-status="computedStatus"
        :order="getOrderDetail"
        @close="router.push({name: 'ClientsFind'})"
    />
  </div>
</template>

<style lang="scss" src="./Find.scss" scoped/>