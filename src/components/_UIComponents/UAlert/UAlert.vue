<script>
import UButton from "@/components/_UIComponents/UButton/UButton.vue";

export default {
  name: "UAlert",
  components: {
    UButton
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'alert',
      variance: ['alert', 'confirm']
    }
  },
  beforeCreate() {
    document.body.style.overflow = "hidden";
  },
  setup(_, {emit}) {

    const close = () => {
      document.body.removeAttribute('style');
      emit("close");
    }
    const accept = () => {
      document.body.removeAttribute('style');
      emit("accept");
    }

    window.addEventListener("keydown", (e) => {
      if(e.key === "Escape") {
        close();
      }
    });

    return {
      close, accept
    }
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="u-alert" @click="close">
      <div class="u-alert__content" @click.stop>
        <p class="sub-title">{{ title }}</p>
        <div v-if="type === 'alert'" class="u-alert__actions">
          <u-button @click="close">Да</u-button>
        </div>
        <div v-else class="u-alert__actions">
          <u-button @click="close" modifier="red">Нет</u-button>
          <u-button @click="accept">Да</u-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" src="./UAlert.scss" scoped/>