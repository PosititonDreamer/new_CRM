<script>
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {Magazines} from "@/store/Admin/Magazines/Magazines.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {HookMagazines} from "@/hooks/pages/Magazines/index.js";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";

export default {
  components: {USelect, UInput, UPopup, UForm, UButton},
  async beforeMount() {
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()
    const {findMinDate} = Magazines()

    await findMeasureUnits()
    await findProducts()
    await findMinDate()
  },
  setup() {
    const {
      getMinDate,
      route,
      router,
      magazine,
      computedAllMagazines,
      computedSelectWarehouse,
      computedMagazinesHead,
      submitFindGraphics,
      getMagazinesInfo
    } = HookMagazines()

    return {
      getMinDate,
      route,
      router,
      magazine,
      computedAllMagazines,
      computedSelectWarehouse,
      computedMagazinesHead,
      getMagazinesInfo,
      submitFindGraphics
    }
  }
}
</script>
<template>
  <div class="magazines">
    <u-button
        class="magazines__create"
        @click="router.push({name: 'MagazinesSetting'})"
    >
      Настройка журнала
    </u-button>

    <template v-if="computedAllMagazines">
      <h2 class="magazines__title">{{getMagazinesInfo.date_start.split("-").reverse().join('.')}}-{{getMagazinesInfo.date_end.split("-").reverse().join('.')}}</h2>
      <h2 class="magazines__title">{{computedSelectWarehouse.find(item => item.value === getMagazinesInfo.warehouse).name}}</h2>
    </template>

    <template v-if="computedAllMagazines?.goods.length">
      <h2 class="magazines__title">Фасованные товары</h2>
      <div class="magazines__wrapper">
        <div class="magazines__table " :style="`--columns: ${computedMagazinesHead.length}`">
          <div class="magazines__row magazines__row--head magazines__row--goods">
            <div class="magazines__item magazines__item--long magazines__item--head">
              Название
            </div>
            <div :class="['magazines__item magazines__item--head', {'magazines__item--color-red': head.supply_type === 'outcome','magazines__item--color-green': head.supply_type === 'income' }]" v-for="head in computedMagazinesHead"
                 :key="`goods-${head.date}`">
              {{ head.date }}
              <span v-if="head.type">
              {{ head.type }}
            </span>
            </div>
          </div>

          <div class="magazines__row  magazines__row--goods" v-for="product in computedAllMagazines?.goods"
               :key="`good-title-${product.title}`">
            <div class="magazines__item magazines__item--left magazines__product-title"
                 :style="`--row: ${product.goods.length}`">{{ product.title }}
            </div>
            <template v-for="good in product.goods">
              <div class="magazines__item magazines__item--stop-pos magazines__item--left">{{ good.quantity }}
                {{ product.measure }}
              </div>
              <div :class="[`magazines__item magazines__item--hover magazines__item--color-${balance.type}`]" v-for="balance in good.list">
                {{ balance.balance }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-if="computedAllMagazines?.weight.length">
      <h2 class="magazines__title">Весовые товары</h2>
      <div class="magazines__wrapper">
        <div class="magazines__table " :style="`--columns: ${computedMagazinesHead.length}`">
          <div class="magazines__row magazines__row--head">
            <div class="magazines__item magazines__item--head">
              Название
            </div>
            <div :class="['magazines__item magazines__item--head', {'magazines__item--color-red': head.supply_type === 'outcome','magazines__item--color-green': head.supply_type === 'income' }]" v-for="head in computedMagazinesHead"
                 :key="`goods-${head.date}`">
              {{ head.date }}
              <span v-if="head.type">
              {{ head.type }}
            </span>
            </div>
          </div>
          <div class="magazines__row" v-for="product in computedAllMagazines.weight">
            <div class="magazines__item magazines__item--left magazines__product-title">
              {{product.title}} ({{product.measure}})
            </div>
            <div
                v-for="balance in product.goods.list"
                :class="[`magazines__item magazines__item--hover magazines__item--color-${balance.type}`]"
            >
              {{balance.balance}}
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="computedAllMagazines?.consumable.length">
      <h2 class="magazines__title">Расходники</h2>
      <div class="magazines__wrapper">
        <div class="magazines__table " :style="`--columns: ${computedMagazinesHead.length}`">
          <div class="magazines__row magazines__row--head">
            <div class="magazines__item magazines__item--head">
              Название
            </div>
            <div :class="['magazines__item magazines__item--head', {'magazines__item--color-red': head.supply_type === 'outcome','magazines__item--color-green': head.supply_type === 'income' }]" v-for="head in computedMagazinesHead"
                 :key="`goods-${head.date}`">
              {{ head.date }}
              <span v-if="head.type">
              {{ head.type }}
            </span>
            </div>
          </div>
          <div class="magazines__row" v-for="product in computedAllMagazines.consumable">
            <div class="magazines__item magazines__item--left magazines__product-title">
              {{product.title}}
            </div>
            <div :class="[`magazines__item magazines__item--hover magazines__item--color-${balance.type}`]" v-for="balance in product.goods">
              {{balance.balance}}
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="computedAllMagazines?.other.length">
      <h2 class="magazines__title">Коробки и магниты</h2>
      <div class="magazines__wrapper">
        <div class="magazines__table " :style="`--columns: ${computedMagazinesHead.length}`">
          <div class="magazines__row magazines__row--head">
            <div class="magazines__item magazines__item--head">
              Название
            </div>
            <div :class="['magazines__item magazines__item--head', {'magazines__item--color-red': head.supply_type === 'outcome','magazines__item--color-green': head.supply_type === 'income' }]" v-for="head in computedMagazinesHead"
                 :key="`goods-${head.date}`">
              {{ head.date }}
              <span v-if="head.type">
              {{ head.type }}
            </span>
            </div>
          </div>
          <div class="magazines__row" v-for="product in computedAllMagazines.other">
            <div class="magazines__item magazines__item--left magazines__product-title">
              {{product.title}}
            </div>
            <div :class="[`magazines__item magazines__item--hover magazines__item--color-${balance.type}`]" v-for="balance in product.goods">
              {{balance.balance}}
            </div>
          </div>
        </div>
      </div>
    </template>

    <u-popup
        v-if="route.name === 'MagazinesSetting'"
        title="Поиск журнала"
        @close="router.push({name: 'Magazines'})"
    >
      <u-form
          text="Настроить журнал"
          @submit.prevent="submitFindGraphics"
      >
        <div class="list">
          <u-input
              title="Минимальная дата"
              type="date"
              :min="getMinDate"
              :max="magazine.date_end.value.value ? magazine.date_end.value.value: new Date().toISOString().split('T')[0]"
              :start-value="magazine.date_start.value.value"
              v-model="magazine.date_start.value.value"
              :error="magazine.date_start.value.error"
              @change="magazine.date_start.value.tacked = true"
              @blur="magazine.date_start.value.tacked = true"
          />
          <u-input
              title="Максимальная дата"
              type="date"
              :min="magazine.date_start.value.value ? magazine.date_start.value.value: getMinDate"
              :max="new Date().toISOString().split('T')[0]"
              :start-value="magazine.date_end.value.value"
              v-model="magazine.date_end.value.value"
              :error="magazine.date_end.value.error"
              @change="magazine.date_end.value.tacked = true"
              @blur="magazine.date_end.value.tacked = true"
          />
          <u-select
              title="Склад"
              :values="computedSelectWarehouse"
              :start-value="magazine.warehouse.value.value"
              v-model="magazine.warehouse.value.value"
              :error="magazine.warehouse.value.error"
              @change="magazine.warehouse.value.tacked = true"
              @blur="magazine.warehouse.value.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./Magazines.scss" scoped/>