<script>
import {Graphics} from "@/hooks/pages/Graphics/index.js";
import {HookGraphics} from "@/store/Admin/Graphics/Graphics.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import {Chart, Grid, Line, Tooltip} from "vue3-charts";
import {computed, ref, watch} from "vue";

export default {
  name: 'Graphics',
  components: {Tooltip, Line, Grid, Chart, UCard, UAccordion, UInput, UForm, UPopup, UButton},
  async beforeCreate() {
    const {
      findGraphicsMinDate
    } = Graphics()

    await findGraphicsMinDate();
  },
  setup() {
    const {
      getGraphics,
      getMinDate,
      submitFindGraphics,
      router,
      route,
      date_start,
      date_end,
      direction,
      margin,
      config,
      configOrders,
      computedGraphicsOrdersLines,
      computedGraphicsLines,
      computedGraphicsOrdersDay,
      computedGraphicsOrdersWeek,
      computedGraphicsOrdersMonth,
      computedGraphicsOrdersYear,
      computedGraphicDay,
      computedGraphicWeek,
      computedGraphicMonth,
      computedGraphicYear,
    } = HookGraphics()

    const changeRoute = (to) => {
      if (to.name === 'Graphics') {
        date_start.value.value = ''
        date_end.value.value = ''

        date_start.value.tacked = false
        date_end.value.tacked = false
      }
    }

    watch(route, () => {
      changeRoute(route.name)
    })

    changeRoute(route.name)

    return {
      getGraphics,
      getMinDate,
      submitFindGraphics,
      router,
      route,
      date_start,
      date_end,
      direction,
      margin,
      config,
      computedGraphicDay,
      computedGraphicsLines,
      computedGraphicWeek,
      computedGraphicMonth,
      computedGraphicYear,
      configOrders,
      computedGraphicsOrdersDay,
      computedGraphicsOrdersWeek,
      computedGraphicsOrdersMonth,
      computedGraphicsOrdersYear,
      computedGraphicsOrdersLines,
    }
  }
}
</script>

<template>
  <div class="graphics">
    <u-button
        class="graphics__create"
        @click="router.push({name: 'GraphicsSetting'})"
    >
      Настройки графика
    </u-button>

    <div class="graphics__list" v-if="getGraphics">
      <p class="title">Графики за:
        {{
          new Date(getGraphics.date_start).toLocaleDateString('ru-RU')
        }}
        -
        {{ new Date(getGraphics.date_end).toLocaleDateString('ru-RU') }}
      </p>
      <p class="text">
        <b>Заказов: </b> {{ getGraphics.orders.count }}
      </p>
      <p class="graphics__sub-title sub-title">Общие расходы по видам товаров:</p>
      <p class="graphics__sub-title sub-title">Товары:</p>
      <p class="text" v-for="item in getGraphics.goods">
        <b>{{ item.product }}: </b> {{ item.quantity }} {{ item.measure }}
        <template v-if="+item.composition_quantity">
          + {{ item.composition_quantity }} {{ item.measure }} (В составных товарах)
        </template>
      </p>
      <p class="graphics__sub-title sub-title">Расходники:</p>
      <p class="text" v-for="item in getGraphics.consumable">
        <b>{{ item.title }}: </b> {{ item.quantity }} шт.
      </p>
      <p class="graphics__sub-title sub-title">Коробки и магниты:</p>
      <p class="text" v-for="item in getGraphics.other">
        <b>{{ item.title }}: </b> {{ item.quantity }} шт.
      </p>

      <p class="graphics__sub-title sub-title">Детальная информация:</p>
      <div class="list">
        <u-card
            key="orders-graphics-detail"
        >
          <u-accordion
              title="Заказы"
              key="orders-graphics-detail"
          >
            <div class="list">
              <u-card
                  v-if="getGraphics.orders.dates.length"
              >
                <p class="title">Графики по дням</p>
                <Chart
                    class="graphics__picture"
                    :size="{ width: computedGraphicsOrdersDay.length * 50, height: 150 }"
                    :data="computedGraphicsOrdersDay"
                    :margin="margin"
                    :direction="direction">

                  <template #layers>
                    <Grid strokeDasharray="2,2"/>
                    <Line v-for="product in computedGraphicsOrdersLines" :dataKeys="['name', product.name]"
                          :id="product.name"
                          :lineStyle="{ stroke: product.color }"/>
                  </template>

                  <template #widgets>
                    <Tooltip
                        borderColor="#48CAE4"
                        :config="{
                          name: { hide: true },
                          ...configOrders}"
                    />
                  </template>
                </Chart>
              </u-card>
              <u-card
                  v-if="getGraphics.orders.weeks.length > 1"
              >
                <p class="title">Графики по неделям</p>
                <Chart
                    class="graphics__picture"
                    :size="{ width: computedGraphicsOrdersWeek.length * 70, height: 150 }"
                    :data="computedGraphicsOrdersWeek"
                    :margin="margin"
                    :direction="direction">

                  <template #layers>
                    <Grid strokeDasharray="2,2"/>
                    <Line v-for="product in computedGraphicsOrdersLines" :dataKeys="['name', product.name]"
                          :id="product.name"
                          :lineStyle="{ stroke: product.color }"/>
                  </template>

                  <template #widgets>
                    <Tooltip
                        borderColor="#48CAE4"
                        :config="{
                        name: { hide: true },
                        ...configOrders}"
                    />
                  </template>
                </Chart>
              </u-card>
              <u-card
                  v-if="Object.values(getGraphics.orders.months).length > 1"
              >
                <p class="title">Графики по месяцам</p>
                <Chart
                    class="graphics__picture"
                    :size="{ width: computedGraphicsOrdersMonth.length * 70, height: 150 }"
                    :data="computedGraphicsOrdersMonth"
                    :margin="margin"
                    :direction="direction">

                  <template #layers>
                    <Grid strokeDasharray="2,2"/>
                    <Line v-for="product in computedGraphicsOrdersLines" :dataKeys="['name', product.name]"
                          :id="product.name"
                          :lineStyle="{ stroke: product.color }"/>
                  </template>

                  <template #widgets>
                    <Tooltip
                        borderColor="#48CAE4"
                        :config="{
                          name: { hide: true },
                          ...configOrders}"
                    />
                  </template>
                </Chart>
              </u-card>
              <u-card
                  v-if="Object.values(getGraphics.orders.years).length > 1"
              >
                <p class="title">Графики по годам</p>
                <Chart
                    class="graphics__picture"
                    :size="{ width: computedGraphicsOrdersYear.length * 50, height: 150 }"
                    :data="computedGraphicsOrdersYear"
                    :margin="margin"
                    :direction="direction">

                  <template #layers>
                    <Grid strokeDasharray="2,2"/>
                    <Line v-for="product in computedGraphicsOrdersLines" :dataKeys="['name', product.name]"
                          :id="product.name"
                          :lineStyle="{ stroke: product.color }"/>
                  </template>

                  <template #widgets>
                    <Tooltip
                        borderColor="#48CAE4"
                        :config="{
                          name: { hide: true },
                          ...configOrders}"
                    />
                  </template>
                </Chart>
              </u-card>
            </div>
          </u-accordion>
        </u-card>
        <u-card
            v-for="item in getGraphics.goods"
            :key="`graphic-item-${item.product}`"
        >
          <u-accordion
              :title="item.product"
              key="orders-graphics-detail"
          >
            <p class="text">
              <b>Всего потрачено: </b> {{ +item.quantity + +item.composition_quantity }} {{ item.measure }}
              <template v-if="+item.composition_quantity">
                ({{ item.quantity }} + {{ item.composition_quantity }})
              </template>
            </p>
            <p class="text" v-if="+item.orders">
              <b>Всего заказов: </b> {{ item.orders }}
            </p>
            <p class="text" v-if="+item.orders">
              <b>Процент от заказов с участием продута: </b>
              {{ (100 / +getGraphics.orders.count * +item.orders).toFixed(2) }}%
            </p>
            <div v-if="item.types.length">
              <div class="list">
                <u-card
                    v-for="type in item.types.sort((a,b) => +a.count - +b.count)"
                    :key="`graphic-type-${item.product}-${type.count}`"
                >
                  <p class="sub-title">{{ type?.count }}
                    {{ item.measure }}</p>
                  <p class="text">
                    <b>Заказов: </b> {{ type.orders }}
                  </p>
                  <p class="text" v-if="+item.orders">
                    <b>Процент от заказов {{ item.product }}: </b> {{ (100 / +item.orders * +type.orders).toFixed(2) }}%
                  </p>
                  <p class="text" v-if="+item.orders">
                    <b>Процент от заказов с участием товара: </b>
                    {{ (100 / +getGraphics.orders.count * +type.orders).toFixed(2) }}%
                  </p>
                  <p class="text">
                    <b>Расходы: </b> {{ type.quantity }} шт.
                  </p>
                </u-card>
                <u-card
                    v-if="item.dates.length"
                >
                  <u-accordion
                      title="Графики по дням"
                  >
                    <template
                        v-for="type in item.types"
                    >
                      <p class="graphics__sub-title sub-title">{{ type.count }} {{ item.measure }}</p>
                      <Chart
                          class="graphics__picture"
                          :size="{ width: computedGraphicDay(item, type).length * 50, height: 150 }"
                          :data="computedGraphicDay(item, type)"
                          :margin="margin"
                          :direction="direction">

                        <template #layers>
                          <Grid strokeDasharray="2,2"/>
                          <Line v-for="product in computedGraphicsLines" :dataKeys="['name', product.name]"
                                :id="product.name"
                                :lineStyle="{ stroke: product.color }"/>
                        </template>

                        <template #widgets>
                          <Tooltip
                              borderColor="#48CAE4"
                              :config="{
                          name: { hide: true },
                          ...config}"
                          />
                        </template>
                      </Chart>
                    </template>
                  </u-accordion>
                </u-card>
                <u-card
                    v-if="item.weeks.length > 1"
                >
                  <u-accordion
                      title="Графики по неделям"
                  >
                    <template
                        v-for="type in item.types"
                    >
                      <p class="graphics__sub-title sub-title">{{ type.count }} {{ item.measure }}</p>
                      <Chart
                          class="graphics__picture"
                          :size="{ width: computedGraphicWeek(item, type).length * 70, height: 150 }"
                          :data="computedGraphicWeek(item, type)"
                          :margin="margin"
                          :direction="direction">

                        <template #layers>
                          <Grid strokeDasharray="2,2"/>
                          <Line v-for="product in computedGraphicsLines" :dataKeys="['name', product.name]"
                                :id="product.name"
                                :lineStyle="{ stroke: product.color }"/>
                        </template>

                        <template #widgets>
                          <Tooltip
                              borderColor="#48CAE4"
                              :config="{
                          name: { hide: true },
                          ...config}"
                          />
                        </template>
                      </Chart>
                    </template>
                  </u-accordion>
                </u-card>
                <u-card
                    v-if="Object.values(item.months).length > 1"
                >
                  <u-accordion
                      title="Графики по месяцам"
                  >
                    <template
                        v-for="type in item.types"
                    >
                      <p class="graphics__sub-title sub-title">{{ type.count }} {{ item.measure }}</p>
                      <Chart
                          class="graphics__picture"
                          :size="{ width: computedGraphicMonth(item, type).length * 70, height: 150 }"
                          :data="computedGraphicMonth(item, type)"
                          :margin="margin"
                          :direction="direction">

                        <template #layers>
                          <Grid strokeDasharray="2,2"/>
                          <Line v-for="product in computedGraphicsLines" :dataKeys="['name', product.name]"
                                :id="product.name"
                                :lineStyle="{ stroke: product.color }"/>
                        </template>

                        <template #widgets>
                          <Tooltip
                              borderColor="#48CAE4"
                              :config="{
                          name: { hide: true },
                          ...config}"
                          />
                        </template>
                      </Chart>
                    </template>
                  </u-accordion>
                </u-card>
                <u-card
                    v-if="Object.values(item.years).length > 1"
                >
                  <u-accordion
                      title="Графики по годам"
                  >
                    <template
                        v-for="type in item.types"
                    >
                      <p class="graphics__sub-title sub-title">{{ type.count }} {{ item.measure }}</p>
                      <Chart
                          class="graphics__picture"
                          :size="{ width: computedGraphicYear(item, type).length * 50, height: 150 }"
                          :data="computedGraphicYear(item, type)"
                          :margin="margin"
                          :direction="direction">

                        <template #layers>
                          <Grid strokeDasharray="2,2"/>
                          <Line v-for="product in computedGraphicsLines" :dataKeys="['name', product.name]"
                                :id="product.name"
                                :lineStyle="{ stroke: product.color }"/>
                        </template>

                        <template #widgets>
                          <Tooltip
                              borderColor="#48CAE4"
                              :config="{
                          name: { hide: true },
                          ...config}"
                          />
                        </template>
                      </Chart>
                    </template>
                  </u-accordion>
                </u-card>
              </div>
            </div>
          </u-accordion>
        </u-card>
      </div>
    </div>

    <u-popup
        v-if="route.name === 'GraphicsSetting'"
        title="Найти графики"
        @close="router.push({name: 'Graphics'})"
    >
      <u-form
          text="Настроить графики"
          @submit.prevent="submitFindGraphics"
      >
        <div class="list">
          <u-input
              title="Минимальная дата"
              type="date"
              :min="getMinDate"
              :max="date_end.value ? date_end.value: new Date().toISOString().split('T')[0]"
              :start-value="date_start.value"
              v-model="date_start.value"
              :error="date_start.error"
              @change="date_start.tacked = true"
          />
          <u-input
              title="Максимальная дата"
              type="date"
              :min="date_start.value ? date_start.value: getMinDate"
              :max="new Date().toISOString().split('T')[0]"
              :start-value="date_end.value"
              v-model="date_end.value"
          />
        </div>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Graphics.scss" scoped/>