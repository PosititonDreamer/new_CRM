<script>
import {HookPromos} from "@/hooks/pages/Promos/index.js";
import {Promos} from "@/store/Admin/Promos/Promos.js";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import {computed, ref, watch} from "vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";

export default {
  name: 'Promos',
  components: {UAlert, UInput, UForm, UPopup, UActions, UCard, UButton},
  async beforeCreate() {
    const {
      findPromos
    } = Promos()

    await findPromos();
  },
  setup() {
    const {
      router,
      route,
      date_start,
      date_end,
      title,
      getPromos,
      submitCreatePromos,
      submitUpdatePromos,
      submitDeletePromos,
      actionsPromos,
      clearData
    } = HookPromos()

    const loading = ref(true)

    const changeRoute = (to) => {
      if (to.name === 'Promos') {
        clearData()
      }

      if (to.name === 'PromosUpdate' && route.params.id) {
        loading.value = false
        if (!getPromos.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findPromos = getPromos.value.find(promo => +promo.id === +route.params.id)
        date_start.value.value = findPromos.date_start
        date_end.value.value = findPromos.date_end
        title.value.value = findPromos.title

        date_start.value.tacked = true
        date_end.value.tacked = true
        title.value.tacked = true
        setTimeout(() => {
          loading.value = true
        })
      }
    }

    watch(route, (to) => {
      changeRoute(to);
    })

    changeRoute(route)

    const minDate = computed(() => {
      const date = new Date().toISOString().split('T')[0].split('-')
      date.pop()
      return date.join('-') + '-01'
    })

    return {
      router,
      route,
      date_start,
      date_end,
      title,
      getPromos,
      submitCreatePromos,
      submitUpdatePromos,
      submitDeletePromos,
      actionsPromos,
      loading,
      minDate
    }
  }
}
</script>

<template>
  <div class="promos">
    <u-button
        class="promos__create"
        @click="router.push({name: 'PromosCreate'})"
    >
      Добавить промокод
    </u-button>
    <div class="list promos__list">
      <u-card
          v-for="(promo, id) in getPromos"
          :key="`promo-${promo.id}`"
          class="promos__item"
          :style="[{'--z-index': getPromos.length - id}]"
      >
        <p class="sub-title">{{ promo.title }}</p>
        <u-actions
            class="promos__actions"
            :actions="actionsPromos"
            :key="`promos-actions-${promo.id}`"
            @update="router.push({name: 'PromosUpdate', params: {id: promo.id}})"
            @remove="router.push({name: 'PromosDelete', params: {id: promo.id}})"
        />
        <p class="text">
          <b>Период активности: </b> {{ new Date(promo.date_start).toLocaleDateString('ru-RU') }} -
          {{ new Date(promo.date_end).toLocaleDateString('ru-RU') }}
        </p>
      </u-card>
    </div>
    <u-popup
        v-if="route.name === 'PromosCreate'"
        title="Добавление промокода"
        @close="router.push({name: 'Promos'})"
    >
      <u-form
          text="Добавить промокод"
          @submit.prevent="submitCreatePromos"
      >
        <div class="list">
          <u-input
              title="Промокод"
              :start-value="title.value"
              v-model="title.value"
              :error="title.error"
              @change="title.tacked = true"
          />
          <u-input
              title="Минимальная дата"
              type="date"
              :min="minDate"
              :max="date_end.value ? date_end.value : ''"
              :start-value="date_start.value"
              v-model="date_start.value"
              :error="date_start.error"
              @change="date_start.tacked = true"
          />
          <u-input
              title="Максимальная дата"
              type="date"
              :start-value="date_end.value"
              :min="date_start.value ? date_start.value : minDate"
              v-model="date_end.value"
              :error="date_end.error"
              @change="date_end.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
    <u-popup
        v-if="route.name === 'PromosUpdate' && loading && route.params.id"
        title="Изменение промокода"
        @close="router.push({name: 'Promos'})"
    >
      <u-form
          text="Изменить промокод"
          @submit.prevent="submitUpdatePromos"
      >
        <div class="list">
          <u-input
              title="Промокод"
              :start-value="title.value"
              v-model="title.value"
              :error="title.error"
              @change="title.tacked = true"
          />
          <u-input
              title="Минимальная дата"
              type="date"
              :min="date_start.value ? date_start.value : ''"
              :max="date_end.value ? date_end.value : ''"
              :start-value="date_start.value"
              v-model="date_start.value"
              :error="date_start.error"
              @change="date_start.tacked = true"
          />
          <u-input
              title="Максимальная дата"
              type="date"
              :min="date_start.value ? date_start.value : ''"
              :start-value="date_end.value"
              v-model="date_end.value"
              :error="date_end.error"
              @change="date_end.tacked = true"
          />
        </div>
      </u-form>
    </u-popup>
    <u-alert
        v-if="route.name === 'PromosDelete' && route.params.id"
        title="Удалить промокод?"
        type="confirm"
        @close="router.push({name: 'Promos'})"
        @accept="submitDeletePromos"
    />
  </div>
</template>

<style lang="scss" src="./Promos.scss" scoped/>