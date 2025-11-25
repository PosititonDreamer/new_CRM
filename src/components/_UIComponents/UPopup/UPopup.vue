<script>
export default {
  name: "UPopup",
  props: {
    title: {
      type: String,
      required: true,
    },
    big: {
      type: Boolean,
      default: false,
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

    window.addEventListener("keydown", (e) => {
      if(e.key === "Escape") {
        close();
      }
    });

    return {
      close
    }
  },
}
</script>

<template>
  <Teleport to="body">
    <div :class="['u-popup', {'u-popup--big': big}]" @click="close">
      <div class="u-popup__wrapper" @click.stop>
        <div class="u-popup__header">
          <p class="u-popup__title title">{{ title }}</p>
          <button class="u-popup__close" @click="close"></button>
        </div>
        <div class="u-popup__content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" src="./UPopup.scss" scoped/>