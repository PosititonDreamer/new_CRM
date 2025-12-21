<script>
import {GoodsKit} from "@/store/Admin/Goods/Kits.js";
import {Goods} from "@/store/Admin/Goods/Goods.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import {HookGoodsKit} from "@/hooks/pages/Goods/Kits.js";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";

export default {
  name: "GoodsKit",
  components: {UCheckbox, UAlert, USelect, UInput, UForm, UPopup, UAccordion, UActions, UCard, UButton},
  async beforeCreate() {
    const {findGoodsKit} = GoodsKit()
    const {findGoods} = Goods()
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()

    await findGoodsKit()
    await findGoods()
    await findProducts()
    await findMeasureUnits()

  },
  setup() {
    const {
      route,
      router,
      kit,
      addItem,
      removeItem,
      getGoodsKit,
      submitCreateGoodsKit,
      submitUpdateGoodsKit,
      submitDeleteGoodsKit,
    } = HookGoodsKit()

    const loading = ref(false)

    const {findGoodsKit} = GoodsKit()
    const {findGoods, getGoods} = Goods()
    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()

    watch(() => route.params.warehouse,
        () => {
          findGoods()
          findGoodsKit()
        }
    )

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "delete",
        text: "Удалить"
      },
    ])

    const changeRoute = (to) => {
      if (to.name === "GoodsKit") {
        kit.title.value.value = ""
        kit.number.value.value = 0

        kit.title.value.tacked = false
        kit.number.value.tacked = false
        kit.list.value = []

        document.body.removeAttribute("style");
        return;
      }
      if (to.name === 'GoodsKitCreate') {
        addItem()
        return;
      }
      if (to.name === 'GoodsKitUpdate' && to.params.id) {
        if (!getGoodsKit.value.length || !getGoods.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findKit = getGoodsKit.value.find(item => +item.id === +to.params.id)
        kit.title.value.value = findKit.title
        kit.number.value.value = findKit.number
        kit.comment.value.value = findKit.comment
        kit.viewComment.value = findKit.view_comment


        findKit.list.forEach(item => {
          const good = getGoods.value.find(good => good.id === item.good)
          addItem({
            quantity: +item.quantity,
            good: item.good,
            product: good.product
          }, item.id)
        })

        kit.title.value.tacked = true
        kit.number.value.tacked = true
        kit.comment.value.tacked = true
        loading.value = true
      }
    }

    const computedGoods = computed(() => {
      if (!getGoods.value.length) {
        return []
      }

      return getGoods.value.map(good => {
        good.product_item = getProducts.value.find(item => item.id === good.product)
        good.measure = getMeasureUnits.value.find(item => item.id === good.product_item.measure_unit)

        return {
          name: `${good.quantity} ${good.measure?.title ? good.measure?.title : ''}`,
          value: good.id,
          product: good.product
        }
      })
    })

    const computedProducts = computed(() => {
      if (!getProducts.value.length) {
        return []
      }

      return getProducts.value.map(product => {
        return {
          name: product.show_title ? product.show_title : product.title,
          value: product.id
        }
      })
    })

    const computedKits = computed(() => {
      if (!getGoodsKit.value.length || !getGoods.value.length || !getProducts.value.length || !getMeasureUnits.value.length) {
        return []
      }
      return getGoodsKit.value.map(kit => {
        kit.list = kit.list.map(item => {
          const findGood = getGoods.value.find(good => good.id === item.good)
          const findProduct = getProducts.value.find(product => product.id === findGood.product)
          const MeasureUnits = getMeasureUnits.value.find(unit => unit.id === findProduct.measure_unit)
          item.title = `${findProduct?.show_title ? findProduct.show_title : findProduct.title}, ${findGood.quantity} ${MeasureUnits?.title ? MeasureUnits?.title : ''}`
          return item
        })
        return kit
      })
    })

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      route,
      router,
      kit,
      addItem,
      removeItem,
      getGoodsKit,
      submitCreateGoodsKit,
      submitUpdateGoodsKit,
      submitDeleteGoodsKit,
      actions,
      loading,
      getGoods,
      getProducts,
      getMeasureUnits,
      computedGoods,
      computedProducts,
      computedKits
    }
  }
}
</script>

<template>
  <div class="goods-kit">
    <u-button
        @click="router.push({name: 'GoodsKitCreate', params: {warehouse: route.params.warehouse}})"
        class="goods-kit__create"
    >
      Добавить набор
    </u-button>
    <div class="list goods-kit__list">
      <u-card
          v-for="(kit, id) in computedKits"
          class="goods-kit__item"
          :key="`good-kit-${kit.id}`"
          :style="[{'--z-index': computedKits.length - id}]"
      >
        <p class="sub-title">{{ kit.title }}</p>
        <p class="text">
          <b>Номер набора: </b> {{ kit.number }}
        </p>
        <p class="text" v-if="kit.view_comment">
          <b>Системный комментарий: </b> {{ kit.comment }}
        </p>
        <u-actions
            class="goods-kit__actions"
            :actions="actions"
            @update="router.push({name: 'GoodsKitUpdate', params: {id: kit.id}})"
            @delete="router.push({name: 'GoodsKitDelete', params: {id: kit.id}})"
        />
        <u-accordion
            class="goods-kit__accordion"
            title="Входящие фасованные товары"
            small
        >
          <div class="goods-kit__content">
            <p
                v-for="item in kit.list"
                class="text"
                :key="`good-kit-text-item-${item.id}`"
            >
              {{ item.title }}, {{ item.quantity }} шт.
            </p>
          </div>
        </u-accordion>
      </u-card>
    </div>
    <u-alert
        v-if="route.name === 'GoodsKitDelete' && route.params.id"
        title="Удалить набор?"
        type="confirm"
        @close="router.push({name: 'GoodsKit', params: {warehouse: route.params.warehouse}})"
        @accept="submitDeleteGoodsKit"
    />
    <u-popup
        v-if="route.name === 'GoodsKitCreate' && computedGoods.length && computedProducts.length"
        title="Добавление набора"
        @close="router.push({name: 'GoodsKit', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          text="Добавить набор"
          @submit.prevent="submitCreateGoodsKit"
      >
        <div class="list">

          <u-input
              title="Название"
              :start-value="kit.title.value.value"
              :error="kit.title.value.error"
              v-model="kit.title.value.value"
              @change="kit.title.value.tacked = true"
              @blur="kit.title.value.tacked = true"
          />
          <u-input
              title="Номер"
              type="number"
              :start-value="kit.number.value.value"
              :error="kit.number.value.error"
              v-model="kit.number.value.value"
              @change="kit.number.value.tacked = true"
              @blur="kit.number.value.tacked = true"
          />
          <u-checkbox
              title="Добавить комментарий?"
              name="comment"
              value="1"
              :checked="kit.viewComment.value"
              @checked="kit.viewComment.value = !kit.viewComment.value"
          />
          <u-input
              v-if="kit.viewComment.value"
              title="Комментарий"
              type="textarea"
              :start-value="kit.comment.value.value"
              :error="kit.comment.value.error"
              v-model="kit.comment.value.value"
              @change="kit.comment.value.tacked = true"
              @blur="kit.comment.value.tacked = true"
          />
          <u-card>
            <p class="sub-title">Фасованные товары</p>
            <div class="list">

              <u-card
                  v-for="(item, id) in kit.list.value"
                  :key="`good-kit-item${item.id}`"
                  :class="['list goods-kit__form-item', {'goods-kit__form-item--division': kit.list.value.length > 1}]"
                  :style="[{'--z-index': kit.list.value.length - id}]"
              >
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
                    class="goods-kit__select goods-kit__select--product"
                />
                <u-select
                    v-if="item.product.value"
                    title="Товар"
                    :values="computedGoods.filter(good =>  good.product === item.product.value)"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
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
                <u-button
                    v-if="kit.list.value.length > 1"
                    type="button"
                    modifier="red"
                    class="goods-kit__delete-kit"
                    @click="removeItem(item.id)"
                />
              </u-card>
              <u-button
                  type="button"
                  @click="addItem()"
                  class="goods-kit__add-kit"
              >
                Добавить товар
              </u-button>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'GoodsKitUpdate' && loading"
        title="Изменение набора"
        @close="router.push({name: 'GoodsKit', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          text="Изменить набор"
          @submit.prevent="submitUpdateGoodsKit"
      >
        <div class="list">

          <u-input
              title="Название"
              :start-value="kit.title.value.value"
              :error="kit.title.value.error"
              v-model="kit.title.value.value"
              @change="kit.title.value.tacked = true"
              @blur="kit.title.value.tacked = true"
          />
          <u-input
              title="Номер"
              type="number"
              :start-value="kit.number.value.value"
              :error="kit.number.value.error"
              v-model="kit.number.value.value"
              @change="kit.number.value.tacked = true"
              @blur="kit.number.value.tacked = true"
          />
          <u-checkbox
              title="Добавить комментарий?"
              name="comment"
              value="1"
              :checked="kit.viewComment.value"
              @checked="kit.viewComment.value = !kit.viewComment.value"
          />
          <u-input
              v-if="kit.viewComment.value"
              title="Комментарий"
              type="textarea"
              :start-value="kit.comment.value.value"
              :error="kit.comment.value.error"
              v-model="kit.comment.value.value"
              @change="kit.comment.value.tacked = true"
              @blur="kit.comment.value.tacked = true"
          />
          <u-card>
            <p class="sub-title">Фасованные товары</p>
            <div class="list">

              <u-card
                  v-for="(item, id) in kit.list.value"
                  :key="`good-kit-item${item.id}`"
                  :class="['list goods-kit__form-item', {'goods-kit__form-item--division': kit.list.value.length > 1}]"
                  :style="[{'--z-index': kit.list.value.length - id}]"
              >
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
                    class="goods-kit__select goods-kit__select--product"
                />
                <u-select
                    v-if="item.product.value"
                    title="Товар"
                    :values="computedGoods.filter(good =>  good.product === item.product.value)"
                    :start-value="item.good.value"
                    :error="item.good.error"
                    v-model="item.good.value"
                    @change="item.good.tacked = true"
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
                <u-button
                    v-if="kit.list.value.length > 1"
                    type="button"
                    modifier="red"
                    class="goods-kit__delete-kit"
                    @click="removeItem(item.id)"
                />
              </u-card>
              <u-button
                  type="button"
                  @click="addItem()"
                  class="goods-kit__add-kit"
              >
                Добавить товар
              </u-button>
            </div>
          </u-card>
        </div>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Kit.scss" scoped/>
