<script>
import {ref, watch} from "vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {useRoute} from "vue-router";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import {Auth} from "@/store/workers/Auth.js";

export default {
  name: "Sidebar",
  components: {UAccordion},
  setup() {
    const {getWorker} = Auth()
    const open = ref(false)

    const openSidebar = () => {
      open.value = true
      document.body.style.overflow = "hidden"
    }

    const {getWarehouses, getWarehousesTypes} = Warehouses()
    const route = useRoute()

    const closeSidebar = () => {
      open.value = false
      document.body.removeAttribute("style")
    }

    if(getWorker.value.rule === 'Админ') {
      const {findWarehouses} = Warehouses()

      findWarehouses()
    }

    watch(route,
        () => {
          closeSidebar()
        }
    )


    return {
      open,
      route,
      openSidebar,
      closeSidebar,
      getWarehouses,
      getWarehousesTypes,
      getWorker
    }
  }
}
</script>

<template>
  <button class="sidebar-open" @click="openSidebar">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <div :class="['sidebar', {'sidebar--open': open}]">
    <div class="sidebar__content">
      <button class="sidebar__close" @click="closeSidebar"></button>
      <div class="sidebar__list" v-if="getWorker.rule === 'Админ'">
        <div class="sidebar__item">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'Orders' || route.name === 'OrdersFind'}] ">Заказы</p>
          <div class="sidebar__sub-list">
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Orders', params: {status: 3}}">В обработке</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Orders', params: {status: 1}}">Текущие</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Orders', params: {status: 2}}">Собранные</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Orders', params: {status: 4}}">Отправленные</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Orders', params: {status: 5}}">Возвращенные</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'OrdersFind'}">Поиск заказов</router-link>
            </div>
          </div>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Clients'}">Клиенты</router-link>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Products'}">Продукты</router-link>
          <div class="sidebar__sub-list">
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Other'}">Кривые продукты</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'MeasureUnits'}">Единицы измерения</router-link>
            </div>
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Packing'}">Упаковки</router-link>
            </div>
          </div>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Workers'}">Работники</router-link>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Salaries'}">Зарплаты</router-link>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Warehouses'}">Склады</router-link>
          <div class="sidebar__sub-list" v-if="getWarehouses.length">
            <div class="sidebar__item">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Supplies'}">Связь складов</router-link>
            </div>
            <div class="sidebar__item" v-for="warehouse in getWarehouses">
              <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.params.warehouse === warehouse.id}] ">{{warehouse.title}}</p>
              <div class="sidebar__sub-list">
                <div class="sidebar__item">
                  <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Goods', params: {warehouse: warehouse.id}}">Фасованные товары</router-link>
                </div>
                <div class="sidebar__item">
                  <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'GoodsWeight', params: {warehouse: warehouse.id}}">Весовые товары</router-link>
                </div>
                <div class="sidebar__item">
                  <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'GoodsConsumable', params: {warehouse: warehouse.id}}">Расходники</router-link>
                </div>
                <div class="sidebar__item">
                  <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'GoodsOther', params: {warehouse: warehouse.id}}">Коробки и магниты</router-link>
                </div>
                <div class="sidebar__item" v-if="getWarehousesTypes.find(type => type.id === warehouse.type)?.title === 'Товарный'">
                  <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'GoodsKit', params: {warehouse: warehouse.id}}">Наборы товаров</router-link>
                </div>
                <div class="sidebar__item" v-if="warehouse.supply">
                  <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'SuppliesWarehouse', params: {warehouse: warehouse.id}}">Поставки</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Graphics'}">Графики</router-link>
        </div>
        <div class="sidebar__item">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Promos'}">Промокоды</router-link>
        </div>
      </div>
      <div class="sidebar__list" v-else-if="getWorker.rule === 'Сборщик'">
      </div>
      <div class="sidebar__list" v-else>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Sidebar.scss" scoped />