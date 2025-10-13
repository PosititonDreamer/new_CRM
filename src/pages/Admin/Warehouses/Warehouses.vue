<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import {HookWarehouses} from "@/hooks/pages/Warehouses/index.js";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import {computed, ref, watch} from "vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";

export default {
  name: "Warehouses",
  components: {USelect, UInput, UForm, UPopup, UAlert, UActions, UCard, UButton},
  async beforeMount() {
    const {findWarehouses} = Warehouses()

    await findWarehouses()
  },
  setup() {
    const {getWarehouses, getWarehousesTypes} = Warehouses()
    const {
      title,
      description,
      type,
      router,
      route,
      submitCreateWarehouses,
      submitUpdateWarehouses,
      submitDeleteWarehouses,
    } = HookWarehouses()
    const loading = ref(false);

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

    const types = computed(() => {
      return getWarehousesTypes.value.map(getType => {
        return {
          name: getType.title,
          value: getType.id
        }
      })
    })

    const changeRoute = (to) => {
      if(to.name === "Warehouses") {
        title.value.value = ""
        description.value.value = ""
        type.value.value = ""

        title.value.tacked = false
        description.value.tacked = false
        type.value.tacked = false

        document.body.removeAttribute("style");
        return;
      }
      if(to.name === 'WarehousesUpdate' && to.params.id){
        if(!getWarehousesTypes.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findWarehouse = getWarehouses.value.find((item) => item.id === to.params.id)
        title.value.value = findWarehouse.title
        description.value.value = findWarehouse.description
        type.value.value = findWarehouse.type

        title.value.tacked = true
        description.value.tacked = true
        type.value.tacked = true
        loading.value = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      title,
      description,
      type,
      router,
      route,
      submitCreateWarehouses,
      submitUpdateWarehouses,
      submitDeleteWarehouses,
      getWarehouses,
      getWarehousesTypes,
      actions,
      types,
      loading
    }
  }
}
</script>

<template>
  <div class="warehouses">
    <u-button class="warehouses__create" @click="router.push({name: 'WarehousesCreate'})">Добавить склад</u-button>
    <div class="warehouses__list">
      <u-card
          class="warehouses__item"
          v-for="(warehouse, id) in getWarehouses"
          :key="`warehouses-${warehouse.id}`"
          :style="[{'--z-index': getWarehouses.length - id}]"
      >
        <p class="warehouses__title">{{ warehouse.title }}</p>
        <div class="warehouses__content">
          <p class="warehouses__text">
            <b>Описание: </b> {{ warehouse.description }}
          </p>
          <p class="warehouses__text">

            <b>Тип: </b> {{ getWarehousesTypes.find(getType => getType.id === warehouse.type)?.title }}
          </p>
        </div>
        <u-actions
            class="warehouses__actions"
            :actions="actions"
            @remove="router.push({name: 'WarehousesDelete', params: {id: warehouse.id}})"
            @update="router.push({name: 'WarehousesUpdate', params: {id: warehouse.id}})"
        />
      </u-card>
    </div>

    <u-alert
        v-if="route.name === 'WarehousesDelete' && route.params.id"
        title="Удалить склад?"
        type="confirm"
        @close="router.push({name: 'Warehouses'})"
        @accept="submitDeleteWarehouses()"
    />

    <u-popup
        v-if="route.name === 'WarehousesCreate' && getWarehousesTypes.length"
        title="Добавление склада"
        @close="router.push({name: 'Warehouses'})"
    >
      <u-form text="Добавить склад" @submit.prevent="submitCreateWarehouses">
        <u-input
            title="Название"
            :start-value="title.value"
            :error="title.error"
            v-model="title.value"
            @change="title.tacked = true"
            @blur="title.tacked = true"
        />
        <u-input
            type="textarea"
            title="Описание"
            :start-value="description.value"
            :error="description.error"
            v-model="description.value"
            @change="description.tacked = true"
            @blur="description.tacked = true"
        />
        <u-select
            title="Тип склада"
            :values="types"
            :start-value="type.value"
            :error="type.error"
            v-model="type.value"
            @change="type.tacked = true"
        />
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'WarehousesUpdate' && getWarehousesTypes.length && loading"
        title="Изменение склада"
        @close="router.push({name: 'Warehouses'})"
    >
      <u-form text="Изменить склад" @submit.prevent="submitUpdateWarehouses">
        <u-input
            title="Название"
            :start-value="title.value"
            :error="title.error"
            v-model="title.value"
            @change="title.tacked = true"
            @blur="title.tacked = true"
        />
        <u-input
            type="textarea"
            title="Описание"
            :start-value="description.value"
            :error="description.error"
            v-model="description.value"
            @change="description.tacked = true"
            @blur="description.tacked = true"
        />
        <u-select
            title="Тип склада"
            :values="types"
            :start-value="type.value"
            :error="type.error"
            v-model="type.value"
            @change="type.tacked = true"
        />
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Warehouses.scss" scoped/>