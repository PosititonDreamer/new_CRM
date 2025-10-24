<script>
import {useRoute} from "vue-router";
import {GoodsOther} from "@/store/Admin/Goods/Other.js";
import {HookGoodsOther} from "@/hooks/pages/Goods/Other.js";
import {computed, ref, watch} from "vue";
import UButton from "@/components/_UIComponents/UButton/UButton.vue";
import UCard from "@/components/_UIComponents/UCard/UCard.vue";
import UActions from "@/components/_UIComponents/UActions/UActions.vue";
import UAlert from "@/components/_UIComponents/UAlert/UAlert.vue";
import UPopup from "@/components/_UIComponents/UPopup/UPopup.vue";
import UForm from "@/components/_UIComponents/UForm/UForm.vue";
import UInput from "@/components/_UIComponents/UInput/UInput.vue";
import USelect from "@/components/_UIComponents/USelect/USelect.vue";

export default {
  name: "GoodsOther",
  components: {USelect, UInput, UForm, UPopup, UAlert, UActions, UCard, UButton},
  async beforeCreate() {
    const {findGoodsOther} = GoodsOther()

    await findGoodsOther();
  },
  setup() {
    const {findGoodsOther} = GoodsOther()
    const {
      getGoodsOther,
      getGoodsOtherType,
      route,
      router,
      other,
      submitCreateOther,
      submitUpdateOther,
      submitUpdateBalanceOther,
      submitDeleteOther,
    } = HookGoodsOther()
    const loading = ref(false)

    watch(() => route.params.warehouse,
        () => {
          findGoodsOther()
        }
    )
    const actions = ref([
      {
        name: "update",
        text: "Изменить"
      },
      {
        name: "updateBalance",
        text: "Изменить баланс",
      },
      {
        name: "delete",
        text: "Удалить"
      },
    ])

    const types = computed(() => {
      return getGoodsOtherType.value.map(type => {
        return {
          value: type.id,
          name: type.title
        }
      })
    })

    const changeRoute = (to) => {
      if (to.name === "GoodsOther") {
        other.title.value.value = ''
        other.type.value.value = ''
        other.few.value.value = 0
        other.few_very.value.value = 0
        other.sort.value.value = 0
        other.balance.value.value = 0

        other.title.value.tacked = false
        other.type.value.tacked = false


        document.body.removeAttribute("style");
        return;
      }

      if((to.name === 'GoodsOtherUpdate') || (to.name === 'GoodsOtherUpdateBalance' && to.params.id)) {
        if (!getGoodsOther.value.length) {
          setTimeout(() => {
            changeRoute(to)
          })
          return
        }
        const findOther = getGoodsOther.value.find(other => +other.id === +route.params.id)
        other.title.value.value = findOther.title
        other.type.value.value = findOther.type
        other.few.value.value = findOther.few
        other.few_very.value.value = findOther.few_very
        other.balance.value.value = findOther.balance
        other.sort.value.value = findOther.sort

        other.title.value.tacked = true
        other.type.value.tacked = true
        loading.value = true
      }
    }

    watch(route, (to) => {
      changeRoute(to)
    })

    changeRoute(route)

    return {
      getGoodsOther,
      getGoodsOtherType,
      route,
      router,
      other,
      submitCreateOther,
      submitUpdateOther,
      submitUpdateBalanceOther,
      submitDeleteOther,
      actions,
      types,
      loading
    }
  }
}
</script>

<template>
  <div class="goods-other">
    <u-button
        class="goods-other__create"
        @click="router.push({name: 'GoodsOtherCreate', params: {warehouse: route.params.warehouse}})"
    >
      Добавить коробку или магнит
    </u-button>
    <div class="goods-other__list">
      <u-card
          v-for="(other,id) in getGoodsOther"
          class="goods-other__item"
          :key="`good-other-${other.id}`"
          :style="[{'--z-index': getGoodsOther.length - id}]"
      >
        <p class="goods-other__title">{{other.title}}</p>
        <div class="goods-other__content">
          <p class="goods-other__text">
            <b>Тип: </b> {{getGoodsOtherType.find(type => +type.id === +other.type)?.title}}
          </p>
          <p :class="['goods-other__text', {'goods-other__text--few': +other.balance <= +other.few && +other.balance > +other.few_very}, {'goods-other__text--few-very': +other.balance <= +other.few_very}]">
            <b>Остаток: </b> {{other.balance}}
            <span v-if="+other.balance <= +other.few && +other.balance > +other.few_very">мало расходника</span>
            <span v-if="+other.balance <= +other.few_very">очень мало расходника</span>
          </p>
        </div>
        <u-actions
            :actions="actions"
            class="goods-other__actions"
            @update="router.push({name: 'GoodsOtherUpdate', params: {id: other.id}})"
            @updateBalance="router.push({name: 'GoodsOtherUpdateBalance', params: {id: other.id}})"
            @delete="router.push({name: 'GoodsOtherDelete', params: {id: other.id}})"
        />
      </u-card>
    </div>
    <u-alert
        v-if="route.name === 'GoodsOtherDelete' && route.params.id"
        title="Удалить коробку или магнит?"
        type="confirm"
        @close="router.push({name: 'GoodsOther', params: {warehouse: route.params.warehouse}})"
        @accept="submitDeleteOther"
    />
    <u-popup
        v-if="route.name === 'GoodsOtherCreate'"
        title="Добавление коробки или магнита"
        @close="router.push({name: 'GoodsOther', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          @submit.prevent="submitCreateOther"
          text="Добавить коробку или магнит"
      >
        <u-input
            title="Название"
            :start-value="other.title.value.value"
            :error="other.title.value.error"
            v-model="other.title.value.value"
            @change="other.title.value.tacked = true"
            @blur="other.title.value.tacked = true"
        />
        <u-select
            title="Тип"
            :values="types"
            :start-value="other.type.value.value"
            :error="other.type.value.error"
            v-model="other.type.value.value"
            @change="other.type.value.tacked = true"
        />
        <u-input
            title="Остаток"
            type="number"
            :start-value="other.balance.value.value"
            v-model="other.balance.value.value"
        />
        <u-input
            title="Малое количество коробок или магнитов"
            type="number"
            :start-value="other.few.value.value"
            v-model="other.few.value.value"
        />
        <u-input
            title="Очень малое количество коробок или магнитов"
            type="number"
            :start-value="other.few_very.value.value"
            v-model="other.few_very.value.value"
        />
      </u-form>
    </u-popup>

    <u-popup
        v-if="(route.name === 'GoodsOtherUpdate' || route.name === 'GoodsOtherUpdateBalance') && getGoodsOther.length && loading"
        :title="route.name === 'GoodsOtherUpdate' ? 'Изменение коробки или магнита' : 'Изменение баланса коробки или магнита'"
        @close="router.push({name: 'GoodsOther', params: {warehouse: route.params.warehouse}})"
    >
      <u-form
          @submit.prevent="route.name === 'GoodsOtherUpdate' ? submitUpdateOther() : submitUpdateBalanceOther()"
          :text="route.name === 'GoodsOtherUpdate' ? 'Изменить коробку или магнит' : 'Изменить баланс коробки или магнита'"
      >
        <u-input
            title="Название"
            :start-value="other.title.value.value"
            :error="other.title.value.error"
            v-model="other.title.value.value"
            @change="other.title.value.tacked = true"
            @blur="other.title.value.tacked = true"
            :disabled="route.name === 'GoodsOtherUpdateBalance'"
        />
        <u-select
            title="Тип"
            :values="types"
            :start-value="other.type.value.value"
            :error="other.type.value.error"
            v-model="other.type.value.value"
            @change="other.type.value.tacked = true"
            :disabled="route.name === 'GoodsOtherUpdateBalance'"
        />
        <u-input
            title="Остаток"
            type="number"
            :start-value="other.balance.value.value"
            v-model="other.balance.value.value"
        />
        <u-input
            title="Малое количество коробок или магнитов"
            type="number"
            :start-value="other.few.value.value"
            v-model="other.few.value.value"
            :disabled="route.name === 'GoodsOtherUpdateBalance'"
        />
        <u-input
            title="Очень малое количество коробок или магнитов"
            type="number"
            :start-value="other.few_very.value.value"
            v-model="other.few_very.value.value"
            :disabled="route.name === 'GoodsOtherUpdateBalance'"
        />
      </u-form>
    </u-popup>
  </div>
</template>

<style lang="scss" src="./Other.scss" scoped />
