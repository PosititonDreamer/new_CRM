<script>
import {SuppliesWarehouse} from "@/store/SuppliesWarehouse/SuppliesWarehouse.js";
import {HookSuppliesWarehouse} from "@/hooks/pages/SuppliesWarehouse/index.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import {ref, watch} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: 'SuppliesWarehouse',
  components: {UCheckbox, UActions, UAlert, UCard, USelect, UForm, UPopup, UButton},
  async beforeCreate() {
    const {
      findSuppliesWarehouse
    } = SuppliesWarehouse()

    await findSuppliesWarehouse()
  },
  setup() {
    const {
      route,
      router,
      getSupplies,
      getSuppliesTypes,
      getSuppliesWarehouse,
      getSuppliesDetail,
      createSuppliesWarehouse,
      updateSuppliesWarehouse,
      deleteSuppliesWarehouse,
      sendSuppliesWarehouse,
      acceptSuppliesWarehouse,
      supply,
      computedList,
      suppliesList,
      collectedList,
      submitCreateSuppliesWarehouse,
      submitUpdateSuppliesWarehouse,
      submitDeleteSuppliesWarehouse,
      submitSendSuppliesWarehouse,
      submitAcceptSuppliesWarehouse,
      computedWarehouse,
      clearData,
      changeSupply,
      computedSupplyList,
      computedDetailSupply
    } = HookSuppliesWarehouse()

    const {
      findSuppliesWarehouseDetail
    } = SuppliesWarehouse()

    const loading = ref(true)


    const changeRoute = async (to) => {
      if (to.name === 'SuppliesWarehouse') {
        clearData()
        return
      }
      if (to.name === 'SuppliesWarehouseCreate') {
        if (getSuppliesWarehouse.value.length > 1) {
          return;
        }
        if (getSuppliesWarehouse.value.length === 1) {
          loading.value = false
          supply.value.value = getSuppliesWarehouse.value[0].warehouse_give
          supply.value.tacked = true
          changeSupply()
          if (!suppliesList.value.length) {
            setTimeout(() => {
              changeRoute(to)
            })
            return
          }
          setTimeout(() => {
            loading.value = true
          })
        } else {
          setTimeout(() => {
            changeRoute(to)
          })
        }
      }
      if (to.name === 'SuppliesWarehousesUpdate' || to.name === 'SuppliesWarehousePreview' || to.name === 'SuppliesWarehouseCollect' || to.name === 'SuppliesWarehouseAccept') {
        if (!getSuppliesDetail.value) {
          await findSuppliesWarehouseDetail()
        }
      }
      if (to.name === 'SuppliesWarehouseUpdate') {
        loading.value = false
        supply.value.value = getSuppliesDetail.value.supply.supply_warehouse
        supply.value.tacked = true
        changeSupply()
        if (!suppliesList.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        getSuppliesDetail.value.list.forEach((item) => {
          const findSupply = suppliesList.value.find(supplyItem => +supplyItem.id === +item.supply_warehouse_connection)
          findSupply.value = +item.quantity
        })
        setTimeout(() => {
          loading.value = true
        })
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    const changeInput = (item) => {
      if (item.value.value.value < 0) {
        item.value.value.value = 0
      }
      if (item.value.value.value > item.max.value) {
        item.value.value.value = item.max.value
      }
    }

    return {
      route,
      router,
      getSupplies,
      getSuppliesTypes,
      getSuppliesWarehouse,
      getSuppliesDetail,
      createSuppliesWarehouse,
      updateSuppliesWarehouse,
      deleteSuppliesWarehouse,
      sendSuppliesWarehouse,
      acceptSuppliesWarehouse,
      supply,
      computedList,
      suppliesList,
      collectedList,
      submitCreateSuppliesWarehouse,
      submitUpdateSuppliesWarehouse,
      submitDeleteSuppliesWarehouse,
      submitSendSuppliesWarehouse,
      submitAcceptSuppliesWarehouse,
      computedWarehouse,
      changeSupply,
      loading,
      changeInput,
      computedSupplyList,
      computedDetailSupply
    }
  }
}
</script>

<template>
  <div class="supplies">
    <u-button
        v-if="getSuppliesWarehouse.find(item => item.warehouse_receive === route.params.warehouse)"
        class="supplies__create"
        @click="router.push({name: 'SuppliesWarehouseCreate'})"
    >
      Заказать поставку
    </u-button>
    <div class="supplies__card-list">
      <u-card
          class="supplies__card"
          v-for="(item, id) in computedSupplyList"
          :key="`supplies-${item.id}`"
          :style="[{'--z-index': computedSupplyList.length - id}]"
      >
        <div class="supplies__content">
          <p class="supplies__title">
            {{ item.warehouse }}
          </p>
          <p class="supplies__text">
            <b>Статус: </b> {{ item.status }}
          </p>
          <p class="supplies__text">
            <b>Дата создания: </b> {{ new Date(item.date).toLocaleDateString('ru-RU') }}
          </p>
          <p class="supplies__text">
            <b>Количество товаров: </b> {{ item.length }}
          </p>
        </div>
        <u-actions
            class="supplies__actions"
            :actions="item.actions.value"
            @preview="router.push({name: 'SuppliesWarehousePreview', params: {id: item.id}})"
            @collect="router.push({name: 'SuppliesWarehouseCollect', params: {id: item.id}})"
            @update="router.push({name: 'SuppliesWarehouseUpdate', params: {id: item.id}})"
            @delete="router.push({name: 'SuppliesWarehouseDelete', params: {id: item.id}})"
            @accept="router.push({name: 'SuppliesWarehouseAccept', params: {id: item.id}})"
        />
      </u-card>
    </div>
    <u-popup
        v-if="route.name === 'SuppliesWarehouseCreate' && getSuppliesWarehouse.length && loading && computedList"
        title="Заказ поставки"
        @close="router.push({name: 'SuppliesWarehouse'})"
    >
      <u-form
          text="Заказать поставку"
          @submit.prevent="submitCreateSuppliesWarehouse"
      >
        <u-select
            v-if="computedWarehouse.length > 1"
            title="Поставка из"
            :values="computedWarehouse"
            :start-value="supply.value"
            v-model="supply.value"
            @change="supply.tacked = true"
            @update="changeSupply"
            :error="supply.error"
        />
        <u-select
            v-else
            title="Поставка из"
            :values="computedWarehouse"
            :start-value="supply.value"
            v-model="supply.value"
            disabled
            empty
        />
        <u-card class="supplies__list">
          <p class="supplies__title">Фасованные товары</p>
          <div class="supplies__item" v-for="item in computedList.goods" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }} {{ item.quantity }} {{ item.measure }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
        <u-card class="supplies__list">
          <p class="supplies__title">Весовые товары</p>
          <div class="supplies__item" v-for="item in computedList.weight" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }} {{ item.measure }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
        <u-card class="supplies__list">
          <p class="supplies__title">Расходники</p>
          <div class="supplies__item" v-for="item in computedList.consumable" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
        <u-card class="supplies__list">
          <p class="supplies__title">Коробки и магниты</p>
          <div class="supplies__item" v-for="item in computedList.other" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'SuppliesWarehouseUpdate' && getSuppliesWarehouse.length && loading && computedList"
        title="Изменение поставки"
        @close="router.push({name: 'SuppliesWarehouse'})"
    >
      <u-form
          text="Изменить поставку"
          @submit.prevent="submitUpdateSuppliesWarehouse"
      >
        <u-select
            title="Поставка из"
            :values="computedWarehouse"
            :start-value="supply.value"
            v-model="supply.value"
            disabled
            empty
        />
        <u-card class="supplies__list">
          <p class="supplies__title">Фасованные товары</p>
          <div class="supplies__item" v-for="item in computedList.goods" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }} {{ item.quantity }} {{ item.measure }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
        <u-card class="supplies__list">
          <p class="supplies__title">Весовые товары</p>
          <div class="supplies__item" v-for="item in computedList.weight" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }} {{ item.measure }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
        <u-card class="supplies__list">
          <p class="supplies__title">Расходники</p>
          <div class="supplies__item" v-for="item in computedList.consumable" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
        <u-card class="supplies__list">
          <p class="supplies__title">Коробки и магниты</p>
          <div class="supplies__item" v-for="item in computedList.other" :key="`supplies-item-${item.id}`">
            <p class="supplies__sub-title">{{ item.title }}</p>
            <p :class="['supplies__text', {'supplies__text--few': item.balance <= item.few && item.balance > item.few_very}, {'supplies__text--few-very': item.balance <= item.few_very}]">
              <b>Остаток: </b> {{ item.balance }}
            </p>
            <p class="supplies__text">
              <b>Максимальная поставка: </b> {{ item.max }}
            </p>
            <div class="supplies__input">
              <u-button
                  type="button"
                  @click="() => {
                  item.value.value.value--
                  changeInput(item)
                }"
              >
                -
              </u-button>
              <input
                  type="number"
                  :max="item.max.value"
                  :min="0"
                  v-model="item.value.value.value"
                  @input="changeInput(item)"
              >
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value++
                    changeInput(item)
                  }"
              >
                +
              </u-button>
              <u-button
                  type="button"
                  @click="() => {
                    item.value.value.value = item.max.value ? item.max.value : item.max
                }"
              >
                МАКС
              </u-button>
            </div>
          </div>
        </u-card>
      </u-form>
    </u-popup>
    <u-alert
        v-if="route.name === 'SuppliesWarehouseDelete' && route.params.id"
        title="Удалить поставку?"
        type="confirm"
        @close="router.push({name: 'SuppliesWarehouse'})"
        @accept="submitDeleteSuppliesWarehouse()"
    />
    <u-popup
        v-if="route.name === 'SuppliesWarehousePreview' && computedDetailSupply"
        title="Просмотр поставки"
        @close="router.push({name: 'SuppliesWarehouse'})"
        class="supplies-preview"
    >
      <u-button
          class="supplies-preview__button"
          v-if="computedDetailSupply.statusId === 1 && computedDetailSupply.warehouse === +route.params.warehouse"
          @click="router.push({name: 'SuppliesWarehouseCollect', params: {id: route.params.id}})"
      >
        Собрать
      </u-button>
      <u-button
          class="supplies-preview__button"
          v-if="computedDetailSupply.statusId === 2 && computedDetailSupply.warehouse !== +route.params.warehouse"
          @click="router.push({name: 'SuppliesWarehouseAccept', params: {id: route.params.id}})"
      >
        Принять
      </u-button>
      <p class="supplies-preview__title">
        {{ computedDetailSupply.title }}
      </p>
      <p class="supplies-preview__text">
        <b>Текущий статус поставки: </b> {{ computedDetailSupply.status }}
      </p>
      <p class="supplies-preview__text">
        <b>Дата создания поставки: </b> {{ new Date(computedDetailSupply.date).toLocaleDateString('ru-RU') }}
      </p>
      <u-card class="supplies-preview__status-list">
        <p class="supplies-preview__title">История поставки:</p>
        <div class="supplies-preview__status-item" v-for="(status, id) in computedDetailSupply.statusList"
             :key="`order-status-${id}`">
          <p class="supplies-preview__text">
            <b>Статус поставки: </b>
            {{ status.title }} {{ new Date(status.date).toLocaleDateString('ru-RU') }}
          </p>
        </div>
      </u-card>
      <u-card class="supplies-preview__list">
        <p class="supplies-preview__title">Позиции в поставке:</p>
        <p
            class="supplies-preview__text supplies-preview__list-item"
            v-for="(item, id) in computedDetailSupply.list"
            :key="`supply-preview-item-${item.id}`"
        >
          {{ id + 1 }}. {{ item.title }} - {{ item.quantity }} {{ item.measure }}
        </p>
      </u-card>
    </u-popup>
    <u-popup
        v-if="route.name === 'SuppliesWarehouseCollect' && computedDetailSupply"
        title="Сбор поставки"
        @close="router.push({name: 'SuppliesWarehouse'})"
        class="supplies-collect"
    >
      <u-form
          text="Собрать поставку"
          @submit.prevent="submitSendSuppliesWarehouse"
      >
        <div class="supplies-collect__content">
          <p class="supplies-collect__title">
            {{ computedDetailSupply.title }}
          </p>
          <p class="supplies-collect__text">
            <b>Текущий статус поставки: </b> {{ computedDetailSupply.status }}
          </p>
          <p class="supplies-collect__text">
            <b>Дата создания поставки: </b> {{ new Date(computedDetailSupply.date).toLocaleDateString('ru-RU') }}
          </p>
          <p class="supplies-collect__text">Состав заказа:</p>
          <u-card
              v-for="good in computedDetailSupply.list"
              :key="`order-good-item-${good.id}-${good.type}`"
              :class="['supplies-collect__card', {'supplies-collect__card--collect': collectedList.find(item => +item === +good.id)}]">
            <div class="supplies-collect__info">
              <u-checkbox
                  title=""
                  name="order-collect-good-item"
                  :value="good.id"
                  :checked="!!collectedList.find(item => +item === +good.id)"
                  @checked="!!collectedList.find(item => +item === +good.id) ? collectedList = collectedList.filter(item => +item !== +good.id) : collectedList.push(good.id)"
                  :key="`order-good-check-item-${good.id}-${good.type}`"
              />
              <p class="supplies-collect__name">
                {{ good.title }}
                <span
                    v-if="+good.quantity > 1"
                    class="supplies-collect__over"
                >
                  &nbsp;-&nbsp;{{ good.quantity }} {{ good.measure }}
                </span>
              </p>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'SuppliesWarehouseAccept' && computedDetailSupply"
        title="Прием поставки"
        @close="router.push({name: 'SuppliesWarehouse'})"
        class="supplies-preview"
    >
      <u-form
          text="Принять поставку"
          @submit.prevent="submitAcceptSuppliesWarehouse"
      >
        <div class="supplies-preview">
          <p class="supplies-preview__title">
            {{ computedDetailSupply.title }}
          </p>
          <p class="supplies-preview__text">
            <b>Текущий статус поставки: </b> {{ computedDetailSupply.status }}
          </p>
          <p class="supplies-preview__text">
            <b>Дата создания поставки: </b> {{ new Date(computedDetailSupply.date).toLocaleDateString('ru-RU') }}
          </p>
          <u-card class="supplies-preview__list">
            <p class="supplies-preview__title">Позиции в поставке:</p>
            <p
                class="supplies-preview__text supplies-preview__list-item"
                v-for="(item, id) in computedDetailSupply.list"
                :key="`supply-preview-item-${item.id}`"
            >
              {{ id + 1 }}. {{ item.title }} - {{ item.quantity }} {{ item.measure }}
            </p>
          </u-card>
        </div>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Supplies.scss" scoped/>