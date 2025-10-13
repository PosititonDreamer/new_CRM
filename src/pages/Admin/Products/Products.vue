<script>
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import {computed, ref, watch} from "vue";
import {HookProducts} from "@/hooks/pages/Products/index.js";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";

export default {
  name: "Products",
  components: {USelect, UInput, UForm, UPopup, UAlert, UCard, UActions, UButton},
  props: {},
  async beforeCreate() {
    const {findProducts} = Products()
    const {findMeasureUnits} = MeasureUnits()

    await findProducts()
    await findMeasureUnits()
  },
  setup() {
    const {getMeasureUnits} = MeasureUnits()
    const {
      product,
      getProducts,
      router,
      route,
      submitCreateProduct,
      submitUpdateProduct,
      submitDeleteProduct
    } = HookProducts()

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

    const measures = computed(() => {
      const array = [];

      getMeasureUnits.value.forEach((measureUnit) => {
        array.push({
          name: measureUnit.title,
          value: measureUnit.id
        });
      })

      return array;
    })

    const changeRoute = (to) => {
      if(to.name === "Products") {
        product.measureUnit.value.value = 0
        product.sort.value.value = 0
        product.title.value.value = ""
        product.showTitle.value.value = ""

        product.measureUnit.value.tacked = false
        product.sort.value.tacked = false
        product.title.value.tacked = false
        product.showTitle.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }
      if(to.name === 'ProductsUpdate' && to.params.id){
        if(!getProducts.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findProduct = getProducts.value.find((item) => item.id === to.params.id)
        product.measureUnit.value.value = findProduct.measure_unit === "0" ? "" : findProduct.measure_unit
        product.sort.value.value = +findProduct.sort
        product.title.value.value = findProduct.title
        product.showTitle.value.value = findProduct.show_title

        product.measureUnit.value.tacked = true
        product.sort.value.tacked = true
        product.title.value.tacked = true
        product.showTitle.value.tacked = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      getProducts,
      getMeasureUnits,
      router,
      route,
      actions,
      product,
      submitCreateProduct,
      submitUpdateProduct,
      submitDeleteProduct,
      measures
    }
  }
}
</script>

<template>
  <div class="products">
    <u-button class="products__create" @click="router.push({name: 'ProductsCreate'})">Добавить продукт</u-button>
    <div class="products__list">
      <u-card
          v-for="(product, id) in getProducts"
          class="products__item"
          :key="`products-${product.id}`"
          :style="[{'--z-index': getProducts.length - id}]"
      >
        <div class="products__content">
          <p class="products__title">
            {{ product.show_title ? product.show_title : product.title }}
          </p>
          <p class="products__text">
            <b>Название tilda: </b>{{ product.title }}
            <br>
            <b>Короткое название: </b>{{ product.show_title }}
            <br>
            <b>Единица
              измеренеия: </b>{{ getMeasureUnits.find(measureUnit => measureUnit.id === product.measure_unit)?.title }}
          </p>
        </div>
        <u-actions
            class="products__actions"
            :actions="actions"
            @remove="router.push({name: 'ProductsDelete', params: {id: product.id}})"
            @update="router.push({name: 'ProductsUpdate', params:{id: product.id}})"
            :key="`products-actions-${product.id}`"
        />
      </u-card>
    </div>

    <u-alert
        v-if="route.name === 'ProductsDelete' && route.params.id"
        title="Удалить единицу измеренеия?"
        type="confirm"
        @close="deleteProductId = null"
        @accept="submitDeleteProduct()"
    />

    <u-popup
        v-if="route.name === 'ProductsCreate' && getMeasureUnits.length"
        title="Добавление продукта"
        @close="router.push({name: 'Products'})"
    >
      <u-form
          text="Добавить продукт"
          @submit.prevent="submitCreateProduct"
      >
        <u-input
            title="Название tilda"
            v-model="product.title.value.value"
            :start-value="product.title.value.value"
            @blur="product.title.value.tacked = true"
            @change="product.title.value.tacked = true"
            :error="product.title.value.error"
        />
        <u-input
            title="Короткое название"
            v-model="product.showTitle.value.value"
            :start-value="product.showTitle.value.value"
            @blur="product.showTitle.value.tacked = true"
            @change="product.showTitle.value.tacked = true"
        />
        <u-select
            title="Единица измеренеия"
            :values="measures"
            v-model="product.measureUnit.value.value"
            :start-value="product.measureUnit.value.value"
            @change="product.measureUnit.value.tacked = true"
            :error="product.measureUnit.value.error"
        />
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'ProductsUpdate' && getProducts.find(getProduct => getProduct.id === route.params.id) && product.title.value.value && getMeasureUnits.length"
        title="Изменение продукта"
        @close="router.push({name: 'Products'})"
    >
      <u-form
          text="Изменить продукт"
          @submit.prevent="submitUpdateProduct"
      >
        <u-input
            title="Название tilda"
            v-model="product.title.value.value"
            :start-value="product.title.value.value"
            @blur="product.title.value.tacked = true"
            @change="product.title.value.tacked = true"
            :error="product.title.value.error"
        />
        <u-input
            title="Короткое название"
            v-model="product.showTitle.value.value"
            :start-value="product.showTitle.value.value"
            @blur="product.showTitle.value.tacked = true"
            @change="product.showTitle.value.tacked = true"
        />
        <u-select
            title="Единица измеренеия"
            :values="measures"
            v-model="product.measureUnit.value.value"
            :start-value="product.measureUnit.value.value"
            @change="product.measureUnit.value.tacked = true"
            :error="product.measureUnit.value.error"
        />
        <u-input
            type="number"
            title="Сортировка"
            v-model="product.sort.value.value"
            :start-value="product.sort.value.value"
            @blur="product.sort.value.tacked = true"
            @change="product.sort.value.tacked = true"
        />
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Products.scss" scoped/>