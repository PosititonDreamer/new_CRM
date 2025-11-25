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
    }
  }
}
</script>
<template>
  <div class="notifications">
    <div class="list notifications__list" v-if="computedNotifications">
      <div class="list">
        <u-card
            v-for="item in computedNotifications"
        >
          <u-accordion
              :title="item.title"
          >
            <div class="list">
              <u-card
                  v-if="item.goods.length"
              >
                <u-accordion
                    title="Фасованные товары"
                >
                  <div class="list">
                    <u-card
                        v-for="good in item.goods"
                        :key="`good-${good.id}`"
                    >
                      <p class="text">
                        <b>Название: </b> {{good.title}}
                      </p>
                      <p :class="['text', {'text--bold text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'text--bold text--few-very': +good.balance <= +good.few_very}, {'text--null': +good.balance === 0}]">
                        <b>Остаток: </b> {{ +good.balance }}
                        <span v-if="+good.balance === 0">не осталось товара</span>
                        <span v-else-if="+good.balance <= +good.few && +good.balance > +good.few_very">мало товара</span>
                        <span v-else-if="+good.balance <= +good.few_very">очень мало товара</span>
                      </p>
                    </u-card>
                  </div>
                </u-accordion>
              </u-card>
              <u-card
                  v-if="item.weight.length"
              >
                <u-accordion
                    title="Весовые товары"
                >
                  <div class="list">
                    <u-card
                        v-for="good in item.weight"
                        :key="`weight-${good.id}`"
                    >
                      <p class="text">
                        <b>Название: </b> {{good.title}}
                      </p>
                      <p :class="['text', {'text--bold text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'text--bold text--few-very': +good.balance <= +good.few_very}, {'text--null': +good.balance === 0}]">
                        <b>Остаток: </b> {{ +good.balance }} {{good.measure}}<span v-if="+good.balance === 0">, не осталось товара</span><span v-else-if="+good.balance <= +good.few && +good.balance > +good.few_very">, мало товара</span><span v-else-if="+good.balance <= +good.few_very">, очень мало товара</span>
                      </p>
                    </u-card>
                  </div>
                </u-accordion>
              </u-card>
              <u-card
                  v-if="item.consumable.length"
              >
                <u-accordion
                    title="Расходники"
                >
                  <div class="list">
                    <u-card
                        v-for="good in item.consumable"
                        :key="`consumable-${good.id}`"
                    >
                      <p class="text">
                        <b>Название: </b> {{good.title}}
                      </p>
                      <p :class="['text', {'text--bold text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'text--bold text--few-very': +good.balance <= +good.few_very}, {'text--null': +good.balance === 0}]">
                        <b>Остаток: </b> {{ +good.balance }}
                        <span v-if="+good.balance === 0">не осталось расходника</span>
                        <span v-else-if="+good.balance <= +good.few && +good.balance > +good.few_very">мало расходника</span>
                        <span v-else-if="+good.balance <= +good.few_very">очень мало расходника</span>
                      </p>
                    </u-card>
                  </div>
                </u-accordion>
              </u-card>
              <u-card
                  v-if="item.other.length"
              >
                <u-accordion
                    title="Коробки и магниты"
                >
                  <div class="list">
                    <u-card
                        v-for="good in item.other"
                        :key="`other-${good.id}`"
                    >
                      <p class="text">
                        <b>Название: </b> {{good.title}}
                      </p>
                      <p :class="['text', {'text--bold text--few': +good.balance <= +good.few && +good.balance > +good.few_very}, {'text--bold text--few-very': +good.balance <= +good.few_very}, {'text--null': +good.balance === 0}]">
                        <b>Остаток: </b> {{ +good.balance }}
                        <span v-if="+good.balance === 0">не осталось коробок или магнитов</span>
                        <span v-else-if="+good.balance <= +good.few && +good.balance > +good.few_very">мало коробок или магнитов</span>
                        <span v-else-if="+good.balance <= +good.few_very">очень мало коробок или магнитов</span>
                      </p>
                    </u-card>
                  </div>
                </u-accordion>
              </u-card>
            </div>
          </u-accordion>
        </u-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Notifications.scss" scoped/>