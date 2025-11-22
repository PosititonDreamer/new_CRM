<script>
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import {computed, ref} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";

export default {
  name: "Notifications",
  components: {UAccordion, UCard},
  async beforeCreate() {
    const {findNotificationsDetail} = Warehouses()

    await findNotificationsDetail()
  },
  setup() {
    const {getNotificationsDetail} = Warehouses()
    const opens = ref({})

    const computedNotifications = computed(() => {
      if (!getNotificationsDetail.value) {
        return null
      }
      return getNotificationsDetail.value.warehouses.map(item => {
        const goods = []
        const weight = []
        getNotificationsDetail.value.products.forEach(product => {
          const findMeasure = getNotificationsDetail.value.measure_units.find(measure => +measure.id === +product.measure_unit)
          const findGoods = item.goods.filter(good => +good.product === +product.id)
          const findWeights = item.weight.filter(weight => +weight.product === +product.id)

          findGoods.forEach(good => {
            goods.push({
              id: good.id,
              title: `${product.show_title ? product.show_title : product.title}, ${good.quantity} ${findMeasure.title}`,
              balance: good.balance,
              measure: 'шт.',
              few: good.few,
              few_very: good.few_very,
            })
          })
          findWeights.forEach(good => {
            weight.push({
              id: good.id,
              title: product.show_title ? product.show_title : product.title,
              measure: findMeasure.title,
              balance: good.balance,
              few: good.few,
              few_very: good.few_very,
            })
          })

        })

        return {
          id: item.id,
          title: item.title,
          goods,
          weight,
          consumable: item.consumable.map(item => {
            return {
              id: item.id,
              title: item.title,
              balance: item.balance,
              few: item.few,
              few_very: item.few_very,
              measure: 'шт.',
            }
          }),
          other: item.other.map(item => {
            return {
              id: item.id,
              title: item.title,
              balance: item.balance,
              few: item.few,
              few_very: item.few_very,
              measure: 'шт.',
            }
          }),
        }
      })
    })

    return {
      computedNotifications,
      opens
    }
  }
}
</script>
<template>
  <div class="notifications">
    <div class="notifications__list" v-if="computedNotifications">
      <u-card
          class="notifications__item"
          v-for="item in computedNotifications"
      >
        <u-accordion
            :title="item.title"
            :open="!!opens[`warehouse-${item.id}`]"
            @open="opens[`warehouse-${item.id}`] = !opens[`warehouse-${item.id}`]"
        >
          <u-card
              v-if="item.goods.length"
              class="notifications__item"
          >
            <u-accordion
                title="Фасованные товары"
                :open="!!opens[`warehouse-goods-${item.id}`]"
                @open="opens[`warehouse-goods-${item.id}`] = !opens[`warehouse-goods-${item.id}`]"
            >
              <u-card
                class="notifications__item"
                v-for="good in item.goods"
                :key="`good-${good.id}`"
              >
                <p class="notifications__text">
                  <b>Название: </b> {{good.title}}
                </p>
                <p :class="['notifications__text', {'notifications__text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'notifications__text--few-very': +good.balance <= +good.few_very}]">
                  <b>Остаток: </b> {{ +good.balance }} {{good.measure}}
                </p>
              </u-card>
            </u-accordion>
          </u-card>
          <u-card
              v-if="item.weight.length"
              class="notifications__item"
          >
            <u-accordion
                title="Весовые товары"
                :open="!!opens[`warehouse-weight-${item.id}`]"
                @open="opens[`warehouse-weight-${item.id}`] = !opens[`warehouse-weight-${item.id}`]"
            >
              <u-card
                  class="notifications__item"
                  v-for="good in item.weight"
                  :key="`weight-${good.id}`"
              >
                <p class="notifications__text">
                  <b>Название: </b> {{good.title}}
                </p>
                <p :class="['notifications__text', {'notifications__text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'notifications__text--few-very': +good.balance <= +good.few_very}]">
                  <b>Остаток: </b> {{ +good.balance }} {{good.measure}}
                </p>
              </u-card>
            </u-accordion>
          </u-card>
          <u-card
              v-if="item.consumable.length"
              class="notifications__item"
          >
            <u-accordion
                title="Расходники"
                :open="!!opens[`warehouse-consumable-${item.id}`]"
                @open="opens[`warehouse-consumable-${item.id}`] = !opens[`warehouse-consumable-${item.id}`]"
            >
              <u-card
                  class="notifications__item"
                  v-for="good in item.consumable"
                  :key="`consumable-${good.id}`"
              >
                <p class="notifications__text">
                  <b>Название: </b> {{good.title}}
                </p>
                <p :class="['notifications__text', {'notifications__text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'notifications__text--few-very': +good.balance <= +good.few_very}]">
                  <b>Остаток: </b> {{ +good.balance }} {{good.measure}}
                </p>
              </u-card>
            </u-accordion>
          </u-card>
          <u-card
              v-if="item.other.length"
              class="notifications__item"
          >
            <u-accordion
                title="Коробки и магниты"
                :open="!!opens[`warehouse-other-${item.id}`]"
                @open="opens[`warehouse-other-${item.id}`] = !opens[`warehouse-other-${item.id}`]"
            >
              <u-card
                  class="notifications__item"
                  v-for="good in item.other"
                  :key="`other-${good.id}`"
              >
                <p class="notifications__text">
                  <b>Название: </b> {{good.title}}
                </p>
                <p :class="['notifications__text', {'notifications__text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'notifications__text--few-very': +good.balance <= +good.few_very}]">
                  <b>Остаток: </b> {{ +good.balance }} {{good.measure}}
                </p>
              </u-card>
            </u-accordion>
          </u-card>
        </u-accordion>
      </u-card>
    </div>
  </div>
</template>

<style lang="scss" src="./Notifications.scss" scoped/>