<script>
import {Workers} from "@/store/Admin/Workers/Workers.js";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import {HookWorkers} from "@/hooks/pages/Workers/index.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import {computed, ref, watch} from "vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";
import {Messages} from "@/store/Messages.js";

export default {
  name: "Workers",
  components: {USelect, UInput, UForm, UPopup, UAlert, UActions, UCard, UButton},
  async beforeMount() {
    const {findWorkers} = Workers()
    const {findWarehouses} = Warehouses()

    await findWorkers()
    await findWarehouses()
  },
  setup() {
    const {getWarehouses} = Warehouses()
    const {addMessages} = Messages()
    const {
      router,
      route,
      worker,
      getWorkers,
      getWorkersRules,
      getWorkersWarehouses,
      addWorkerWarehouse,
      removeWorkerWarehouse,
      submitCreateWorkers,
      submitUpdateWorkers,
      submitUpdateTokenWorkers,
      submitDeleteWorkers,
      submitCreatePenaltyWorkers,
      penalty,
      sumPenalty
    } = HookWorkers()
    const loading = ref(false)

    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "remove",
        text: "Удалить"
      },
      {
        name: "updateToken",
        text: "Обновить токен"
      },
      {
        name: "copyToken",
        text: "Скопировать токен"
      },
      {
        name: "createPenalty",
        text: "Выписать штраф"
      }
    ])

    const rules = computed(() => {
      return getWorkersRules.value.map(rule => {
        return {
          name: rule.title,
          value: rule.id
        }
      })
    })

    const copyToken = (token) => {
      navigator.clipboard.writeText(token)
      addMessages(['Токен успешно скопирован'], 'success')
    }

    const changeRoute = (to) => {
      if (to.name === "Workers") {
        worker.salary.value.value = ""
        worker.description.value.value = ""
        worker.rule.value.value = ""
        worker.name.value.value = ""
        penalty.value.value = ''

        worker.salary.value.tacked = false
        worker.description.value.tacked = false
        worker.rule.value.tacked = false
        worker.name.value.tacked = false
        penalty.value.tacked = false
        worker.warehouses.value = []

        document.body.removeAttribute("style");
        return;
      }
      if (to.name === 'WorkersCreate') {
        addWorkerWarehouse()
        return;
      }
      if (to.name === 'WorkersUpdate' && to.params.id) {
        if (!getWorkers.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findWorker = getWorkers.value.find(item => +item.id === +to.params.id)
        worker.salary.value.value = findWorker.salary
        worker.description.value.value = findWorker.description
        worker.rule.value.value = findWorker.rule
        worker.name.value.value = findWorker.name

        const findWorkerWarehouses = getWorkersWarehouses.value.filter(item => {
          return +item.worker === +to.params.id
        })
        findWorkerWarehouses.forEach(item => {
          addWorkerWarehouse(item.warehouse, item.id)
        })

        worker.salary.value.tacked = true
        worker.description.value.tacked = true
        worker.rule.value.tacked = true
        worker.name.value.tacked = true
        worker.warehouses.value.forEach(item => {
          item.warehouse.tacked = true
        })
        loading.value = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)


    const computedWarehouses = computed(() => {
      if (!getWarehouses.value.length) return []
      return getWarehouses.value.map(warehouse => {
        return {
          name: warehouse.title,
          value: warehouse.id,
          selected: !!worker.warehouses.value.find(item => item.warehouse.value === warehouse.id),
        }
      })
    })

    return {
      router,
      route,
      worker,
      getWorkers,
      getWorkersRules,
      getWorkersWarehouses,
      addWorkerWarehouse,
      removeWorkerWarehouse,
      submitCreateWorkers,
      submitUpdateWorkers,
      submitUpdateTokenWorkers,
      submitDeleteWorkers,
      getWarehouses,
      actions,
      copyToken,
      rules,
      computedWarehouses,
      loading,
      submitCreatePenaltyWorkers,
      penalty,
      sumPenalty
    }
  }
}
</script>

<template>
  <div class="workers">
    <u-button @click="router.push({name: 'WorkersCreate'})" class="workers__create">Добавить работника</u-button>
    <div class="workers__list">
      <u-card
          class="workers__item"
          v-for="(item, id) in getWorkers"
          :key="`workers-${item.id}`"
          :style="[{'--z-index': getWorkers.length - id}]"
      >
        <p class="workers__title">{{ item.name }}</p>
        <div class="workers__content">
          <p class="workers__text">
            <b>Описание: </b> {{ item.description }}
          </p>
          <p class="workers__text">
            <b>Роль: </b> {{ getWorkersRules.find(rule => rule.id === item.rule)?.title }}
          </p>
          <p class="workers__text" v-if="getWarehouses.length">
            <b>Склады: </b>
            <span
                v-for="warehouse in getWorkersWarehouses.filter(child => child.worker === item.id)"
            >
              {{ getWarehouses.find(child => child.id === warehouse.warehouse).title }}
            </span>
          </p>
        </div>
        <u-actions
            class="workers__actions"
            :actions="actions"
            :key="`workers-actions-${item.id}`"
            @update="router.push({name: 'WorkersUpdate', params: {id: item.id}})"
            @updateToken="router.push({name: 'WorkersUpdateToken', params: {id: item.id}})"
            @remove="router.push({name: 'WorkersDelete', params: {id: item.id}})"
            @copyToken="copyToken(item.token)"
            @createPenalty="router.push({name: 'WorkersCreatePenalty', params: {id: item.id}})"
        />
      </u-card>
    </div>

    <u-alert
        v-if="route.name === 'WorkersDelete' && route.params.id"
        title="Удалить работника?"
        type="confirm"
        @close="router.push({name: 'Workers'})"
        @accept="submitDeleteWorkers"
    />

    <u-alert
        v-if="route.name === 'WorkersUpdateToken' && route.params.id"
        title="Обновить токен работника?"
        type="confirm"
        @close="router.push({name: 'Workers'})"
        @accept="submitUpdateTokenWorkers"
    />

    <u-popup
        v-if="route.name === 'WorkersCreate' && getWorkersRules.length"
        title="Добавление работника"
        @close="router.push({name: 'Workers'})"
    >
      <u-form
          text="Добавить работника"
          class="workers__form"
          @submit.prevent="submitCreateWorkers"
          @close="router.push({name: 'Workers'})"
      >
        <u-input
            title="Имя"
            v-model="worker.name.value.value"
            :start-value="worker.name.value.value"
            :error="worker.name.value.error"
            @change="worker.name.value.tacked = true"
            @blur="worker.name.value.tacked = true"
        />
        <u-input
            type="textarea"
            title="Описание"
            v-model="worker.description.value.value"
            :start-value="worker.description.value.value"
            :error="worker.description.value.error"
            @change="worker.description.value.tacked = true"
            @blur="worker.description.value.tacked = true"
        />
        <u-input
            type="number"
            title="Зарплата"
            v-model="worker.salary.value.value"
            :start-value="worker.salary.value.value"
            :error="worker.salary.value.error"
            @change="worker.salary.value.tacked = true"
            @blur="worker.salary.value.tacked = true"
        />
        <u-select
            class="workers__rule"
            title="Роль"
            :values="rules"
            v-model="worker.rule.value.value"
            :start-value="worker.rule.value.value"
            :error="worker.rule.value.error"
            @change="worker.rule.value.tacked = true"
        />
        <u-card
            class="workers__warehouse-list"
            v-if="computedWarehouses.length"
        >
          <p class="workers__title">Склады</p>
          <div
              v-for="(warehouse, id) in worker.warehouses.value"
              :class="['workers__warehouse', {'workers__warehouse--division': worker.warehouses.value.length > 1}]"
              :key="`workers-warehouse-${warehouse.id}`"
          >
            <u-select
                class="workers__warehouse-select"
                :title="`Выбор склада ${id+1}`"
                :values="computedWarehouses.filter(ware => !ware.selected || ware.value === warehouse.warehouse.value)"
                :style="[{'--z-index': worker.warehouses.value.length - id}]"
                :start-value="warehouse.warehouse.value"
                :error="warehouse.warehouse.error"
                v-model="warehouse.warehouse.value"
            />
            <u-button
                v-if="worker.warehouses.value.length > 1"
                class="workers__warehouse-delete"
                type="button"
                @click="removeWorkerWarehouse(warehouse.id)"
                modifier="red"
            />
          </div>
          <u-button
              v-if="getWarehouses && worker.warehouses.value.length !== getWarehouses.length"
              @click="addWorkerWarehouse()"
              type="button"
              class="workers__add-warehouse"
          >
            Добавить склад
          </u-button>
        </u-card>
      </u-form>
    </u-popup>

    <u-popup
        v-if="route.name === 'WorkersUpdate' && loading"
        title="Изменение работника"
        @close="router.push({name: 'Workers'})"
    >
      <u-form
          text="Изменить работника"
          class="workers__form"
          @submit.prevent="submitUpdateWorkers"
      >
        <u-input
            title="Имя"
            v-model="worker.name.value.value"
            :start-value="worker.name.value.value"
            :error="worker.name.value.error"
            @change="worker.name.value.tacked = true"
            @blur="worker.name.value.tacked = true"
        />
        <u-input
            type="textarea"
            title="Описание"
            v-model="worker.description.value.value"
            :start-value="worker.description.value.value"
            :error="worker.description.value.error"
            @change="worker.description.value.tacked = true"
            @blur="worker.description.value.tacked = true"
        />
        <u-input
            type="number"
            title="Зарплата"
            v-model="worker.salary.value.value"
            :start-value="worker.salary.value.value"
            :error="worker.salary.value.error"
            @change="worker.salary.value.tacked = true"
            @blur="worker.salary.value.tacked = true"
        />
        <u-select
            class="workers__rule"
            title="Роль"
            :values="rules"
            v-model="worker.rule.value.value"
            :start-value="worker.rule.value.value"
            :error="worker.rule.value.error"
            @change="worker.rule.value.tacked = true"
        />
        <u-card
            class="workers__warehouse-list"
            v-if="computedWarehouses.length"
        >
          <p class="workers__title">Склады</p>
          <div
              v-for="(warehouse, id) in worker.warehouses.value"
              :class="['workers__warehouse', {'workers__warehouse--division': worker.warehouses.value.length > 1}]"
              :key="`workers-warehouse-${warehouse.id}`"
          >
            <u-select
                class="workers__warehouse-select"
                :title="`Выбор склада ${id+1}`"
                :values="computedWarehouses.filter(ware => !ware.selected || ware.value === warehouse.warehouse.value)"
                :style="[{'--z-index': worker.warehouses.value.length - id}]"
                :start-value="warehouse.warehouse.value"
                :error="warehouse.warehouse.error"
                v-model="warehouse.warehouse.value"
            />
            <u-button
                v-if="worker.warehouses.value.length > 1"
                class="workers__warehouse-delete"
                type="button"
                @click="removeWorkerWarehouse(warehouse.id)"
                modifier="red"
            />
          </div>
          <u-button
              v-if="getWarehouses && worker.warehouses.value.length !== getWarehouses.length"
              @click="addWorkerWarehouse()"
              type="button"
              class="workers__add-warehouse"
          >
            Добавить склад
          </u-button>
        </u-card>
      </u-form>
    </u-popup>

    <u-popup
        title="Выписка штрафа"
        v-if="route.name === 'WorkersCreatePenalty'"
    >
      <u-form
          text="Выписать штраф"
          @submit.prevent="submitCreatePenaltyWorkers"
      >
        <u-input
            type="number"
            title="Сумма"
            v-model="sumPenalty.value"
            :start-value="sumPenalty.value"
            :error="sumPenalty.error"
            @change="sumPenalty.tacked = true"
            @blur="sumPenalty.tacked = true"
        />
        <u-input
            type="textarea"
            title="Описание штрафа"
            :start-value="penalty.value"
            v-model="penalty.value"
            :error="penalty.error"
            @change="penalty.tacked = true"
            @blur="penalty.tacked = true"
        />
      </u-form>
    </u-popup>
  </div>
</template>
<style lang="scss" src="./Workers.scss" scoped/>