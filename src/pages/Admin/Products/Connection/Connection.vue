<script>
import {HookProductsConnection} from "@/hooks/pages/Products/Connection.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {ProductsConnection} from "@/store/Admin/Products/Connection.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UCheckbox from "@/components/_UIComponents/UCheckbox/UCheckbox.vue";
import {computed, ref, watch} from "vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";

export default {
  components: {UAccordion, UActions, UAlert, UCheckbox, UCard, UInput, UForm, UPopup, UButton},
  async beforeMount() {
    const {findProducts} = Products();
    const {findProductsConnections} = ProductsConnection();

    await findProducts()
    await findProductsConnections()
  },
  setup() {
    const {
      route,
      router,
      productConnection,
      getProductsConnections,
      submitCreateProductConnections,
      submitUpdateProductConnections,
      submitDeleteProductConnections,
      clearData,
      usedProducts,
    } = HookProductsConnection()

    const {
      getProducts
    } = Products()

    const loading = ref(false)

    const checkedProduct = ({checked, value}) => {
      if (checked) {
        productConnection.list.value.push(+value)
      } else {
        productConnection.list.value = productConnection.list.value.filter(item => +item !== +value)
      }
    }

    const changeRoute = (to) => {
      if (to.name === 'ProductsConnections') {
        clearData()
      }
      if (to.name === 'ProductsConnectionsUpdate' && to.params.id) {
        loading.value = false
        if (!getProductsConnections.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }

        const findConnection = getProductsConnections.value.find(item => +item.id === +route.params.id)
        productConnection.title.value.value = findConnection.title

        findConnection.list.forEach(item => {
          productConnection.list.value.push(+item.product)
        })
        setTimeout(() => {
          loading.value = true
        })
      }
    }

    const currentProducts = computed(() => {
      if (route.params.id) {
        const findConnection = getProductsConnections.value.find(item => +item.id === +route.params.id)
        return findConnection.list.map(item => +item.product)
      }
    })


    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

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

    const findProduct = (id) => {
      const findProduct = getProducts.value.find(item => +item.id === +id)
      return findProduct.show_title ? findProduct.show_title : findProduct.title
    }

    return {
      route,
      router,
      checkedProduct,
      productConnection,
      getProducts,
      getProductsConnections,
      usedProducts,
      loading,
      currentProducts,
      submitUpdateProductConnections,
      submitCreateProductConnections,
      submitDeleteProductConnections,
      actions,
      findProduct,
    }
  }
}
</script>
<template>
  <div class="products-connections">
    <u-button
        class="products-connections__create"
        @click="router.push({name: 'ProductsConnectionsCreate'})"
    >
      Добавить связь продуктов
    </u-button>
    <div class="products-connections__list list">
      <u-card
          class="products-connections__item"
          v-for="(product, id) in getProductsConnections"
          :style="[{'--z-index': getProductsConnections.length - id}]"
      >
        <u-actions
            class="products-connections__actions"
            :actions="actions"
            @remove="router.push({name: 'ProductsConnectionsDelete', params: {id: product.id}})"
            @update="router.push({name: 'ProductsConnectionsUpdate', params:{id: product.id}})"
            :key="`products-connections-actions-${product.id}`"
        />
        <p class="title products-connections__title">{{ product.title }}</p>
        <u-accordion title="Продукты в составе:">
          <p class="text products-connections__text" v-for="item in product.list">
            {{ findProduct(item.product) }}
          </p>
        </u-accordion>
      </u-card>
    </div>
    <u-alert
        v-if="route.name === 'ProductsConnectionsDelete' && route.params.id"
        title="Удалить связь продуктов?"
        type="confirm"
        @close="router.push({name: 'ProductsConnections'})"
        @accept="submitDeleteProductConnections()"
    />
    <u-popup
        v-if="route.name === 'ProductsConnectionsCreate'"
        title="Добавление связи продуктов"
        @close="router.push({name: 'ProductsConnections'})"
    >
      <u-form
          text="Добавить связь продуктов"
          @submit.prevent="submitCreateProductConnections"
      >
        <u-input
            title="Название"
            v-model="productConnection.title.value.value"
            :start-value="productConnection.title.value.value"
            @blur="productConnection.title.value.tacked = true"
            @change="productConnection.title.value.tacked = true"
            :error="productConnection.title.value.error"
        />
        <u-card class="products-connections__products list">
          <template
              v-for="product in getProducts"
          >
            <u-checkbox
                v-if="!usedProducts.includes(+product.id)"
                :title="product.show_title ? product.show_title : product.title"
                :checked="productConnection.list.value.find(item => +item === +product.id)"
                :value="product.id"
                name="product"
                @checked="checkedProduct"
            />
          </template>
        </u-card>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'ProductsConnectionsUpdate' && loading"
        title="Изменение связи продуктов"
        @close="router.push({name: 'ProductsConnections'})"
    >
      <u-form
          text="Изменить связь продуктов"
          @submit.prevent="submitUpdateProductConnections"
      >
        <u-input
            title="Название"
            v-model="productConnection.title.value.value"
            :start-value="productConnection.title.value.value"
            @blur="productConnection.title.value.tacked = true"
            @change="productConnection.title.value.tacked = true"
            :error="productConnection.title.value.error"
        />
        <u-card class="products-connections__products list">
          <template
              v-for="product in getProducts"
          >
            <u-checkbox
                v-if="!usedProducts.includes(+product.id) || currentProducts.includes(+product.id)"
                :title="product.show_title ? product.show_title : product.title"
                :checked="productConnection.list.value.find(item => +item === +product.id)"
                :value="product.id"
                name="product"
                @checked="checkedProduct"
            />
          </template>
        </u-card>
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./Connection.scss" scoped/>