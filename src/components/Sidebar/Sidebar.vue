<script>
import {ref, watch} from "vue";
import UAccordion from "@/components/_UIComponents/UAccordion/UAccordion.vue";
import {useRoute} from "vue-router";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import {Auth} from "@/store/Workers/Auth.js";
import {Assembler} from "@/store/Assembler/Assembler.js";

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

    const {getWarehouses, getWarehousesTypes, getNotifications} = Warehouses()
    const {getWarehouses: warehousesAssembler} = Assembler()
    const route = useRoute()

    const closeSidebar = () => {
      open.value = false
      document.body.removeAttribute("style")
    }

    if (getWorker.value.rule === 'Админ') {
      const {findWarehouses, findNotifications} = Warehouses()

      findWarehouses()
      findNotifications()
    }

    if (getWorker.value.rule === 'Сборщик') {
      const {findWarehouses} = Assembler()

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
      getWorker,
      getNotifications,
      warehousesAssembler
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
      <div class="sidebar__list list" v-if="getWorker.rule === 'Админ'">
        <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Admin'}">Главная</router-link>
        <div class="list">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'Orders' || route.name === 'OrdersFind' || route.name === 'OrderGoods' || route.matched.find(item => item.name === 'Orders')}] ">
            Заказы</p>
          <div class="sidebar__sub-list list">
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OrderGoods'}">Товары в заказе
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'Orders', params: {status: 3}}">В обработке
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'Orders', params: {status: 1}}">Текущие
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'Orders', params: {status: 2}}">Собранные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'Orders', params: {status: 6}}">Собранные без трека
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'Orders', params: {status: 4}}">Отправленные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'Orders', params: {status: 5}}">Возвращенные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'OrdersFind'}">Поиск
                заказов
              </router-link>
            </div>
          </div>
        </div>
        <div class="list">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'Clients' || route.name === 'ClientsFind'}] ">
            Клиенты</p>
          <div class="sidebar__sub-list list">
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Clients'}">Список
                клиентов
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'ClientsFind'}">Поиск
                клиентов
              </router-link>
            </div>
          </div>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Products'}">Продукты
          </router-link>
          <div class="sidebar__sub-list list">
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Other'}">Кривые
                продукты
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'MeasureUnits'}">
                Единицы измерения
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Packing'}">Упаковки
              </router-link>
            </div>
          </div>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Workers'}">Работники
          </router-link>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Salaries'}">Зарплаты
          </router-link>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Warehouses'}">Склады
          </router-link>
          <div class="sidebar__sub-list list" v-if="getWarehouses.length">
            <div class="list" v-if="getNotifications">
              <router-link class="sidebar__link sidebar__link--yellow" active-class="sidebar__link--active"
                           :to="{name: 'Notifications'}">Малое количество товаров
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Supplies'}">Связь
                складов
              </router-link>
            </div>
            <div class="list" v-for="warehouse in getWarehouses">
              <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.params.warehouse === warehouse.id}] ">
                {{ warehouse.title }}</p>
              <div class="sidebar__sub-list list">
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'Goods', params: {warehouse: warehouse.id}}">Фасованные товары
                  </router-link>
                </div>
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'GoodsWeight', params: {warehouse: warehouse.id}}">Весовые товары
                  </router-link>
                </div>
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'GoodsConsumable', params: {warehouse: warehouse.id}}">Расходники
                  </router-link>
                </div>
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'GoodsOther', params: {warehouse: warehouse.id}}">Коробки и магниты
                  </router-link>
                </div>
                <div class="list"
                     v-if="getWarehousesTypes.find(type => type.id === warehouse.type)?.title === 'Товарный'">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'GoodsKit', params: {warehouse: warehouse.id}}">Наборы товаров
                  </router-link>
                </div>
                <div class="list" v-if="warehouse.supply">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'SuppliesWarehouse', params: {warehouse: warehouse.id}}">Поставки
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Graphics'}">Графики
          </router-link>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Promos'}">Промокоды
          </router-link>
        </div>
      </div>
      <div class="sidebar__list list" v-else-if="getWorker.rule === 'Сборщик'">
        <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Assembler'}">Главная</router-link>
        <div class="list" v-if="warehousesAssembler.length && !!warehousesAssembler.find(warehouse => +warehouse.id === 1)">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'AssemblerOrderGoods' || route.name === 'AssemblerOrders' || route.matched.find(item => item.name === 'AssemblerOrders')}] ">
            Заказы</p>
          <div class="sidebar__sub-list list">
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrderGoods'}">Товары в заказе
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrders', params: {status: 3}}">В обработке
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrders', params: {status: 1}}">Текущие
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrders', params: {status: 2}}">Собранные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrders', params: {status: 6}}">Собранные без трека
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrders', params: {status: 4}}">Отправленные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'AssemblerOrders', params: {status: 5}}">Возвращенные
              </router-link>
            </div>
          </div>
        </div>
        <div class="list">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'AssemblerGoods' || route.name === 'AssemblerGoodsWeight'|| route.name === 'AssemblerGoodsConsumable'|| route.name === 'AssemblerGoodsOther'|| route.name === 'AssemblerSupplies'  || route.matched.find(item => item.name === 'AssemblerSupplies')}] ">
            Склады</p>
          <div class="sidebar__sub-list list" v-if="warehousesAssembler.length">
            <div class="list" v-for="warehouse in warehousesAssembler">
              <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.params.warehouse === warehouse.id}] ">
                {{ warehouse.title }}</p>
              <div class="sidebar__sub-list list">
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'AssemblerGoods', params: {warehouse: warehouse.id}}">Фасованные товары
                  </router-link>
                </div>
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'AssemblerGoodsWeight', params: {warehouse: warehouse.id}}">Весовые товары
                  </router-link>
                </div>
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'AssemblerGoodsConsumable', params: {warehouse: warehouse.id}}">Расходники
                  </router-link>
                </div>
                <div class="list">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'AssemblerGoodsOther', params: {warehouse: warehouse.id}}">Коробки и магниты
                  </router-link>
                </div>
                <div class="list" v-if="warehouse.supply">
                  <router-link class="sidebar__link" active-class="sidebar__link--active"
                               :to="{name: 'AssemblerSupplies', params: {warehouse: warehouse.id}}">Поставки
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'AssemblerSalaries'}">Зарплаты
          </router-link>
        </div>
      </div>
      <div class="sidebar__list list" v-else-if="getWorker.rule === 'Оператор'">
        <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'Operator'}">Главная</router-link>
        <div class="list">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'OperatorOrders' || route.name === 'OperatorOrdersFind' || route.matched.find(item => item.name === 'OperatorOrders')}] ">
            Заказы</p>
          <div class="sidebar__sub-list list">
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OperatorOrders', params: {status: 3}}">В обработке
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OperatorOrders', params: {status: 1}}">Текущие
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OperatorOrders', params: {status: 2}}">Собранные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OperatorOrders', params: {status: 6}}">Собранные без трека
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OperatorOrders', params: {status: 4}}">Отправленные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active"
                           :to="{name: 'OperatorOrders', params: {status: 5}}">Возвращенные
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'OperatorOrdersFind'}">Поиск
                заказов
              </router-link>
            </div>
          </div>
        </div>
        <div class="list">
          <p :class="['sidebar__link sidebar__link--disabled', {'sidebar__link--active': route.name === 'OperatorClients' || route.name === 'OperatorClientsFind'}] ">
            Клиенты</p>
          <div class="sidebar__sub-list list">
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'OperatorClients'}">Список
                клиентов
              </router-link>
            </div>
            <div class="list">
              <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'OperatorClientsFind'}">Поиск
                клиентов
              </router-link>
            </div>
          </div>
        </div>
        <div class="list">
          <router-link class="sidebar__link" active-class="sidebar__link--active" :to="{name: 'OperatorSalaries'}">Зарплаты
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Sidebar.scss" scoped/>