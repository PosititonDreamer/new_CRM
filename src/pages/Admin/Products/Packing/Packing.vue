<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {Products} from "@/store/Admin/Products/Products.js";
import {Packing} from "@/store/Admin/Products/Packing.js";
import {HookPacking} from "@/hooks/pages/Products/Packing.js";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import {computed, ref, watch} from "vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";

export default {
  name: "Packing",
  components: {USelect, UForm, UInput, UPopup, UAlert, UAccordion, UActions, UCard, UButton},
  async beforeCreate() {
    const {findProducts} = Products()
    const {findPacking} = Packing()
    const {findMeasureUnits} = MeasureUnits()

    await findProducts()
    await findPacking()
    await findMeasureUnits()
  },
  setup() {
    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()
    const {route, router, getPacking, product, packing, submitCreatePacking, submitUpdatePacking, submitDeletePacking} = HookPacking()


    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "remove",
        text: "Удалить"
      }
    ])

    const computedProducts = computed(() => {
      return getProducts.value.filter(product => !!getPacking.value.find(pack => pack.product === product.id))
    })

    const computedMeasure = computed(() => {
      if(!!product.value.value) {
        const findProduct = getProducts.value.find(getProduct => getProduct.id === product.value.value)
        if(findProduct) {
          return getMeasureUnits.value.find(measureUnit => measureUnit.id === findProduct.measure_unit)?.title
        }

        return ""
      }

      return ""
    })

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

    const changeRoute = (to) => {
      if(to.name === "Packing") {
        product.value.value = ""
        packing.value.value = 0

        product.value.tacked = false
        packing.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }
      if(to.name === 'PackingUpdate' && to.params.id){
        if(!getPacking.value.length || !getProducts.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findPacking = getPacking.value.find(item => item.id === to.params.id)
        product.value.value = findPacking.product
        packing.value.value = +findPacking.packing

        product.value.tacked = true
        packing.value.tacked = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      actions,
      getProducts,
      getPacking,
      route,
      router,
      computedProducts,
      computedMeasure,
      getMeasureUnits,
      submitDeletePacking,
      submitCreatePacking,
      submitUpdatePacking,
      packing,
      product,
      products
    }
  }
}
</script>

<template>
  <div class="packing">
    <u-button class="packing__create" @click="router.push({name: 'PackingCreate'})">Добавить упаковку</u-button>
    <div class="list packing__list">
      <u-card
          v-for="product in computedProducts"
          class="packing__card"
          :key="`packing-${product.id}`"
      >
        <u-accordion
            :title="product.show_title ? product.show_title : product.title"
        >
          <div class="list">
            <u-card
                v-for="(pack, id) in getPacking.filter(getPack => getPack.product === product.id)"
                class="packing__item"
                :style="[{'--z-index': getPacking.filter(getPack => getPack.product === product.id).length - id}]"
            >
              <u-actions
                  class="packing__actions"
                  :actions="actions"
                  :key="`packing-actions-${pack.id}`"
                  @remove="router.push({name: 'PackingDelete', params:{id: pack.id}})"
                  @update="router.push({name: 'PackingUpdate', params:{id: pack.id}})"
              />
              <p class="sub-title">
                {{pack.packing}} {{getMeasureUnits.find(measureUnit => measureUnit.id === product.measure_unit)?.title}}
              </p>
            </u-card>
          </div>
        </u-accordion>
      </u-card>
    </div>

    <u-alert
        v-if="route.name === 'PackingDelete' && route.params.id"
        title="Удалить упаковку?"
        type="confirm"
        @close="router.push({name: 'Packing'})"
        @accept="submitDeletePacking"
    />

    <u-popup
        v-if="route.name === 'PackingCreate' && products.length"
        title="Добавление упаковки"
        @close="router.push({name: 'Packing'})"
    >
      <u-form
          @submit.prevent="submitCreatePacking"
          text="Добавить упаковку"
      >
        <div class="list">
          <u-select
              title="Продукт"
              :values="products"
              :error="product.error"
              :start-value="product.value"
              v-model="product.value"
              @change="product.tacked = true"
          />
          <u-input
              v-model="packing.value"
              :title="`Количество ${computedMeasure}`"
              :start-value="packing.value"
              :error="packing.error"
              @blur="packing.tacked = true"
              @change="packing.tacked = true"
              type="number"
          />
        </div>
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'PackingUpdate' && products.length  && getPacking.length && product.value && packing.value"
        title="Изменение упаковки"
        @close="router.push({name: 'Packing'})"
    >
      <u-form
          @submit.prevent="submitUpdatePacking"
          text="Изменить упаковку"
      >
        <div class="list">
          <u-select
              title="Продукт"
              :values="products"
              :error="product.error"
              :start-value="product.value"
              v-model="product.value"
              @change="product.tacked = true"
          />
          <u-input
              v-model="packing.value"
              :title="`Количество ${computedMeasure}`"
              :start-value="packing.value"
              :error="packing.error"
              @blur="packing.tacked = true"
              @change="packing.tacked = true"
              type="number"
          />
        </div>
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Packing.scss" scoped />