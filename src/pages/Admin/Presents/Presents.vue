<script>
import {Products} from "@/store/Admin/Products/Products.js";
import {Packing} from "@/store/Admin/Products/Packing.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {Presents} from "@/store/Admin/Presents/Presents.js";
import {HookPresents} from "@/hooks/pages/Presents/index.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import {ref, watch} from "vue";

export default {
  components: {UForm, UPopup, UInput, USelect, UAlert, UActions, UCard, UButton},
  async beforeCreate() {
    const {findProducts} = Products()
    const {findPacking} = Packing()
    const {findMeasureUnits} = MeasureUnits()
    const {findPresents} = Presents()

    await findProducts()
    await findPacking()
    await findMeasureUnits()
    await findPresents()
  },
  setup() {
    const {
      getPresents,
      router,
      route,
      product,
      packing,
      clearData,
      submitCreatePresent,
      submitUpdatePresent,
      submitDeletePresent,
      computedProducts,
      computedPackings,
      actionsPresents,
      computedPresents
    } = HookPresents()

    const {getPacking} = Packing()

    const loaded = ref(false)

    const changeRoute = (to) => {
      if(to.name === "Presents") {
        clearData()

        document.body.removeAttribute("style");
        return;
      }
      if(to.name === 'PresentsUpdate' && to.params.id){
        loaded.value = false
        if(!computedProducts.value.length || !getPresents.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }

        const findPresent = getPresents.value.find(present => +present.id === +route.params.id)
        const findPacking = getPacking.value.find(item => +item.id === +findPresent.packing)

        product.value.value = findPacking.product
        packing.value.value = findPacking.id

        product.value.tacked = true
        packing.value.tacked = true
        loaded.value = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      router,
      route,
      getPresents,
      product,
      packing,
      computedProducts,
      computedPackings,
      computedPresents,
      actionsPresents,
      submitDeletePresent,
      submitCreatePresent,
      submitUpdatePresent,
      loaded
    }
  }
}
</script>
<template>
  <div class="presents">
    <div class="presents__button-list">
      <u-button class="presents__create" @click="router.push({name: 'PresentsCreate'})">Добавить подарок</u-button>
    </div>
    <div class="presents__list list">
      <u-card
          v-for="(present, id) in computedPresents"
          class="presents__item"
          :style="[{'z-index': computedPresents.length - id}]"
      >
        <u-actions
            class="presents__actions"
            :actions="actionsPresents"
            :key="`presents-actions-${present.id}`"
            @remove="router.push({name: 'PresentsDelete', params:{id: present.id}})"
            @update="router.push({name: 'PresentsUpdate', params:{id: present.id}})"
        />
        <p class="sub-title">
          {{present.title}}
        </p>
      </u-card>
    </div>
  </div>

  <u-alert
      v-if="route.name === 'PresentsDelete' && route.params.id"
      title="Удалить подарок?"
      type="confirm"
      @close="router.push({name: 'Presents'})"
      @accept="submitDeletePresent"
  />

  <u-popup
      v-if="route.name === 'PresentsCreate' && computedProducts.length"
      title="Добавление подарка"
      @close="router.push({name: 'Presents'})"
  >
    <u-form
        @submit.prevent="submitCreatePresent"
        text="Добавить подарок"
    >
      <div class="list">
        <u-select
            title="Продукт"
            :values="computedProducts"
            :error="product.error"
            :start-value="product.value"
            v-model="product.value"
            @change="product.tacked = true"
        />
        <u-select
            v-if="computedPackings.length"
            title="Упаковка"
            :values="computedPackings"
            :error="packing.error"
            :start-value="packing.value"
            v-model="packing.value"
            @change="packing.tacked = true"
        />
      </div>
    </u-form>
  </u-popup>

  <u-popup
      v-if="route.name === 'PresentsUpdate' && computedProducts.length && route.params.id && computedPresents.length && loaded"
      title="Изменение подарка"
      @close="router.push({name: 'Presents'})"
  >
    <u-form
        @submit.prevent="submitUpdatePresent"
        text="Изменить подарок"
    >
      <div class="list">
        <u-select
            title="Продукт"
            :values="computedProducts"
            :error="product.error"
            :start-value="product.value"
            v-model="product.value"
            @change="product.tacked = true"
        />
        <u-select
            v-if="computedPackings.length"
            title="Упаковка"
            :values="computedPackings"
            :error="packing.error"
            :start-value="packing.value"
            v-model="packing.value"
            @change="packing.tacked = true"
        />
      </div>
    </u-form>
  </u-popup>

</template>
<style lang="scss" src="./Presents.scss" scoped />