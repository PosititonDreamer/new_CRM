<script>
import {Supplies} from "@/store/Admin/Supplies/Supplies.js";
import {HookSupplies} from "@/hooks/pages/Supplies/index.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import {computed, ref, watch} from "vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";

export default {
  name: 'Supplies',
  components: {UAlert, USelect, UForm, UPopup, UActions, UAccordion, UCard, UButton},
  async beforeCreate() {
    const {findSupplies, findGoods} = Supplies()
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()

    await findGoods()
    await findSupplies()
    await findProducts()
    await findMeasureUnits()
  },
  setup() {
    const {
      router,
      route,
      getSupplies,
      getGoods,
      addSuppliesItem,
      deleteSuppliesItem,
      submitCreateSupplies,
      submitUpdateSupplies,
      submitDeleteSupplies,
      clearData,
      suppliesActions,
      warehouseReceive,
      warehouseGive,
      suppliesList,
      suppliesReceive,
      suppliesGive,
      computedSuppliesList,
      findSuppliesList
    } = HookSupplies()
    const {getProducts,} = Products()
    const {getMeasureUnits} = MeasureUnits()
    const {getWarehouses} = Warehouses()
    const give = ref(null)
    const receive = ref(null)
    const type = ref("")
    const loading = ref(true)

    const changeRoute = async (to) => {
      if (to.name === 'Supplies') {
        clearData()
        return
      }

      if (to.name === 'SuppliesUpdate') {
        loading.value = false
        if (!getSupplies.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findSupply = getSupplies.value.find((item) => +item.id === +route.params.id)
        warehouseReceive.value.value = findSupply.warehouse_receive
        warehouseGive.value.value = findSupply.warehouse_give
        findSupply.list.forEach((item) => {
          addSuppliesItem({
            good_receive: item.good_receive,
            good_give: item.good_give,
            good_type: item.good_type,
          }, item.id)
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

    const computedWarehouses = computed(() => {
      return getWarehouses.value.map(item => {
        return {
          name: item.title,
          value: item.id,
        }
      })
    })

    const takeGood = (id, typeGood, direction) => {
      if (type.value === typeGood) {
        if (direction === 'receive') {
          receive.value = id
        } else {
          give.value = id
        }
      } else {
        if (direction === 'receive') {
          receive.value = id
          give.value = null
        } else {
          give.value = id
          receive.value = null
        }
        type.value = typeGood
      }
      if (receive.value && give.value && type.value) {
        addSuppliesItem({
          good_receive: receive.value,
          good_give: give.value,
          good_type: type.value
        })
        receive.value = null
        give.value = null
        type.value = null
      }
    }

    return {
      router,
      route,
      getSupplies,
      getGoods,
      addSuppliesItem,
      deleteSuppliesItem,
      submitCreateSupplies,
      submitUpdateSupplies,
      submitDeleteSupplies,
      getProducts,
      getMeasureUnits,
      getWarehouses,
      suppliesActions,
      computedWarehouses,
      warehouseReceive,
      warehouseGive,
      suppliesList,
      suppliesReceive,
      suppliesGive,
      takeGood,
      give,
      receive,
      type,
      computedSuppliesList,
      loading,
      findSuppliesList
    }
  }
}
</script>

<template>
  <div class="supplies">
    <u-button
        @click="router.push({name: 'SuppliesCreate'})"
        class="supplies__create"
    >
      Добавить связь
    </u-button>
    <div class="supplies__list">
      <u-card
          class="supplies__item"
          v-for="(supply, id) in getSupplies"
          :key="`supply-${supply.id}`"
          :style="[{'--z-index': getSupplies.length - id}]"
      >
        <p class="supplies__text">
          <b>Склад для поставки: </b>
          {{ getWarehouses.find(warehouse => +warehouse.id === +supply.warehouse_receive)?.title }}
        </p>
        <p class="supplies__text">
          <b>Склад от куда поставка: </b>
          {{ getWarehouses.find(warehouse => +warehouse.id === +supply.warehouse_give)?.title }}
        </p>
        <u-accordion
            title="Поставляемые товары"
            :open="!!supply.open"
            @open="supply.open = !supply.open"
        >
          <div class="supplies__sub-list" v-if="findSuppliesList(supply.list).goods.length">
            <p class="supplies__title">Фасованные товары</p>
            <p class="supplies__text" v-for="good in findSuppliesList(supply.list).goods">{{ good.receive }}</p>
          </div>
          <div class="supplies__sub-list" v-if="findSuppliesList(supply.list).weight.length">
            <p class="supplies__title">Весовые товары</p>
            <p class="supplies__text" v-for="good in findSuppliesList(supply.list).weight">{{ good.receive }}</p>
          </div>
          <div class="supplies__sub-list" v-if="findSuppliesList(supply.list).consumable.length">
            <p class="supplies__title">Расходники</p>
            <p class="supplies__text" v-for="good in findSuppliesList(supply.list).consumable">{{ good.receive }}</p>
          </div>
          <div class="supplies__sub-list" v-if="findSuppliesList(supply.list).other.length">
            <p class="supplies__title">Коробки и магниты</p>
            <p class="supplies__text" v-for="good in findSuppliesList(supply.list).other">{{ good.receive }}</p>
          </div>
        </u-accordion>
        <u-actions
            class="supplies__actions"
            :actions="suppliesActions"
            @update="router.push({name: 'SuppliesUpdate', params: {id: supply.id}})"
            @delete="router.push({name: 'SuppliesDelete', params: {id: supply.id}})"
        />
      </u-card>
    </div>

    <u-popup
        v-if="route.name === 'SuppliesCreate' && getWarehouses.length && getProducts.length && getMeasureUnits.length"
        title="Добавление связи складов"
        @close="router.push({name: 'Supplies'})"
        big
    >
      <u-form
          text="Добавить связь складов"
          @submit.prevent="submitCreateSupplies"
      >
        <u-select
            title="Склад для поставки"
            :values="computedWarehouses.filter(item => +item.value !== +warehouseGive.value)"
            :start-value="warehouseReceive.value"
            v-model="warehouseReceive.value"
            :error="warehouseReceive.error"
            @change="() => {
              warehouseReceive.tacked = true
              suppliesList = []
            }"
            class="supplies__select"
        />
        <u-select
            title="Склад от куда поставка"
            :values="computedWarehouses.filter(item => +item.value !== +warehouseReceive.value)"
            :start-value="warehouseGive.value"
            v-model="warehouseGive.value"
            :error="warehouseGive.error"
            @change="() => {
              warehouseGive.tacked = true
              suppliesList = []
            }"
            class="supplies__select supplies__select--two"
        />
        <u-card class="supplies__list-supply">
          <p class="supplies__title">Выбранные связи</p>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Фасованные товары</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.goods"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Весовые товары</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.weight"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Расходники</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.consumable"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Коробки и магниты</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.other"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
        </u-card>
        <template v-if="warehouseGive.value && warehouseReceive.value">
          <p class="supplies__alarm" v-if="!suppliesList.length">Необходимо выбрать хотя бы 1 товар для связи
            складов</p>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Фасованные товары</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Товары из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.goods"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'good', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'good'"
                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Товары из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.goods"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'good', 'give')"
                    type="button"
                    :disabled="+give === +good.id && type === 'good'"
                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Весовые товары</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Товары из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.weight"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'weight', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'weight'"

                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Товары из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.weight"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'weight', 'give')"
                    type="button"
                    :disabled="+give === +good.id && type === 'weight'"

                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Расходники</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Расходники из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.consumable"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'consumable', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'consumable'"

                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Расходники из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.consumable"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'consumable', 'give')"
                    type="button"
                    :disabled="+give === +good.id && type === 'consumable'"

                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Коробки и магниты</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Коробки и магниты из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.other"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'other', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'other'"
                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Коробки и магниты из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.other"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'other', 'give')"
                    type="button"
                    :disabled="+good === +good.id && type === 'other'"
                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
        </template>
        <p class="supplies__alarm" v-else>Для выбора товаров поставки необходимо выбрать склады</p>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'SuppliesUpdate' && getWarehouses.length && getProducts.length && getMeasureUnits.length && getSupplies.length && loading"
        title="Ищменение связи складов"
        @close="router.push({name: 'Supplies'})"
        big
    >
      <u-form
          text="Изменить связь складов"
          @submit.prevent="submitUpdateSupplies"
      >
        <u-select
            title="Склад для поставки"
            :values="computedWarehouses"
            :start-value="warehouseReceive.value"
            class="supplies__select"
            disabled
        />
        <u-select
            title="Склад от куда поставка"
            :values="computedWarehouses"
            :start-value="warehouseGive.value"
            class="supplies__select supplies__select--two"
            disabled
        />
        <u-card class="supplies__list-supply">
          <p class="supplies__title">Выбранные связи</p>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Фасованные товары</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.goods"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Весовые товары</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.weight"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Расходники</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.consumable"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Коробки и магниты</p>
            <div class="supplies__good-item"
                 v-for="good in computedSuppliesList.other"
            >
              <p class="supplies__text">{{ good.receive }}</p>
              <u-button
                  class="supplies__delete-supply"
                  type="button"
                  @click="deleteSuppliesItem(good.id)"
              />
            </div>
          </u-card>
        </u-card>
        <template v-if="warehouseGive.value && warehouseReceive.value">
          <p class="supplies__alarm" v-if="!suppliesList.length">Необходимо выбрать хотя бы 1 товар для связи
            складов</p>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Фасованные товары</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Товары из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.goods"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'good', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'good'"
                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Товары из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.goods"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'good', 'give')"
                    type="button"
                    :disabled="+give === +good.id && type === 'good'"
                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Весовые товары</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Товары из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.weight"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'weight', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'weight'"

                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Товары из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.weight"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'weight', 'give')"
                    type="button"
                    :disabled="+give === +good.id && type === 'weight'"

                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Расходники</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Расходники из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.consumable"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'consumable', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'consumable'"

                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Расходники из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.consumable"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'consumable', 'give')"
                    type="button"
                    :disabled="+give === +good.id && type === 'consumable'"

                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
          <u-card
              class="supplies__card"
          >
            <p class="supplies__title">Коробки и магниты</p>
            <div class="supplies__goods-list">
              <div class="supplies__goods-receive">
                <p class="supplies__text">Коробки и магниты из склада для поставки</p>
                <u-button
                    v-for="good in suppliesReceive.other"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'other', 'receive')"
                    type="button"
                    :disabled="+receive === +good.id && type === 'other'"
                >
                  {{ good.title }}
                </u-button>
              </div>
              <div class="supplies__goods-give">
                <p class="supplies__text">Коробки и магниты из склада от куда поставки</p>
                <u-button
                    v-for="good in suppliesGive.other"
                    :key="`good-${good.id}`"
                    @click="takeGood(good.id, 'other', 'give')"
                    type="button"
                    :disabled="+good === +good.id && type === 'other'"
                >
                  {{ good.title }}
                </u-button>
              </div>
            </div>
          </u-card>
        </template>
        <p class="supplies__alarm" v-else>Для выбора товаров поставки необходимо выбрать склады</p>
      </u-form>
    </u-popup>
    <u-alert
        v-if="route.name === 'SuppliesDelete' && route.params.id"
        title="Удалить связь складов?"
        type="confirm"
        @close="router.push({name: 'Supplies'})"
        @accept="submitDeleteSupplies()"
    />
  </div>
</template>

<style lang="scss" src="./Supplies.scss" scoped/>