<script>
import {Other} from "@/store/Admin/Products/Other.js";
import {HookOther} from "@/hooks/pages/Products/Other.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {Packing} from "@/store/Admin/Products/Packing.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {computed, ref, watch} from "vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";

export default {
  name: "Other",
  components: {UForm, USelect, UInput, UPopup, UActions, UAccordion, UCard},
  async beforeCreate() {
    const {findOthers} = Other()
    const {findProducts} = Products()
    const {findPacking} = Packing()
    const {findMeasureUnits} = MeasureUnits()

    await findOthers()
    await findProducts()
    await findPacking()
    await findMeasureUnits()
  },
  setup() {
    const {route, router, packing, product, getOthers, submitUpdate} = HookOther()
    const {getProducts} = Products()
    const {getPacking} = Packing()
    const {getMeasureUnits} = MeasureUnits()
    const update = ref(false)
    const loading = ref(false)

    const computedData = computed(() => {
      if (!getMeasureUnits.value.length || !getPacking.value.length || !getProducts.value.length || !getOthers.value.length) {
        return []
      }
      return getProducts.value.map(item => {
        const packing = getPacking.value.filter(pack => pack.product === item.id)
        if (packing) {
          item.packing = packing
        }

        const measure = getMeasureUnits.value.find(unit => unit.id === item.measure_unit)
        if (measure) {
          item.measure_unit = measure.title
        }

        const other = getOthers.value.filter(other => item.packing.find(pack => pack.id === other.packing))
        if (other) {
          item.other = other
        }

        return item
      })

    })

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      }
    ])

    const changeRoute = (to) => {
      if (to.name === "Other") {
        product.value.value = ""
        packing.value.value = ""

        product.value.tacked = false
        packing.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }
      if (to.name === 'OtherUpdate' && to.params.id) {
        if (!computedData.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findOther = getOthers.value.find(item => item.id === to.params.id)
        if (findOther.packing) {
          product.value.value = computedData.value.find(item => item.packing.find(pack => pack.id === findOther.packing)).id
          packing.value.value = findOther.packing

          product.value.tacked = true
          packing.value.tacked = true
        } else {
          product.value.value = ""
          packing.value.value = ""

          product.value.tacked = false
          packing.value.tacked = false
        }
        loading.value = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    const products = computed(() => {
      const array = [];

      getProducts.value.forEach(getProduct => {
        array.push({
          name: getProduct.show_title ? getProduct.show_title : getProduct.title,
          value: getProduct.id
        });
      })

      return array;
    })

    const packings = computed(() => {
      const array = [];

      getPacking.value.filter(pack => pack.product === product.value.value).forEach(pack => {
        array.push({
          name: `${pack.packing} ${computedData.value.find(getProduct => getProduct.id === product.value.value).measure_unit}`,
          value: pack.id,
        })
      })

      return array;
    })

    const changeProduct = () => {
      update.value = true
      product.value.tacked = true
      packing.value.tacked = false

      packing.value.value = ""
      setTimeout(() => {
        update.value = false
      })
    }


    return {
      getOthers,
      getProducts,
      getPacking,
      getMeasureUnits,
      computedData,
      actions,
      product,
      packing,
      router,
      route,
      submitUpdate,
      products,
      packings,
      changeProduct,
      update,
      loading
    }
  }
}
</script>

<template>
  <div class="other">
    <div class="other__list">
      <u-card
          v-for="(other, id) in getOthers.filter(getOther => !getOther.packing)"
          class="other__item"
          :style="[{'--z-index': getOthers.filter(getOther => !getOther.packing).length - id}]"
      >
        <div class="other__content">
          <p class="other__text">
            <b>Кривое название: </b> {{ other.title }}<br>
          </p>
          <p class="other__text">
            <b>Привязанная упаковка: </b> Отсутствует
          </p>
        </div>
        <u-actions
            class="other__actions"
            :actions="actions"
            :key="`other-actions-${other.id}`"
            @update="router.push({name: 'OtherUpdate', params: {id: other.id}})"

        />
      </u-card>

      <u-card class="other__card" v-for="product in computedData.filter(item => item.other.length)">
        <u-accordion
            :title="product.show_title ? product.show_title : product.title"
        >
          <div class="other__wrapper">
            <u-card
                v-for="(other, id) in product.other"
                class="other__item"
                :style="[{'--z-index': product.other.length - id}]"
            >
              <div class="other__content">
                <p class="other__text">
                  <b>Кривое название: </b> {{ other.title }}<br>
                </p>
                <p class="other__text">
                  <b>Привязанная упаковка: </b> {{ product.packing.find(pack => pack.id === other.packing)?.packing }}
                  {{ product.measure_unit }}
                </p>
              </div>
              <u-actions
                  class="other__actions"
                  :actions="actions"
                  :key="`other-actions-${other.id}`"
                  @update="router.push({name: 'OtherUpdate', params: {id: other.id}})"
              />
            </u-card>
          </div>
        </u-accordion>
      </u-card>
    </div>
    <u-popup
        v-if="route.name === 'OtherUpdate' && computedData.length && products.length && loading"
        title="Изменение кривого товара"
        @close="router.push({name: 'Other'})"
    >
      <u-form
          @submit.prevent="submitUpdate"
          text="Изменить кривой товар"
      >
        <p class="other__text">
          <b>{{getOthers.find(getOther => getOther.id === route.params.id).title}}</b>
        </p>
        <u-select
            title="Продукт"
            :values="products"
            :error="product.error"
            :start-value="product.value"
            v-model="product.value"
            @change="changeProduct"
            class="other__select-product"
        />
        <u-select
            v-if="!!product.value && !update"
            title="Упаковка"
            :values="packings"
            :error="packing.error"
            :start-value="packing.value"
            v-model="packing.value"
            @change="packing.tacked = true"
            class="other__select-packing"
        />
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Other.scss" scoped/>