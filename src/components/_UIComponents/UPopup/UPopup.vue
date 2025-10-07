<script>
export default {
  name: "UPopup",
  props: {
    title: {
      type: String,
      required: true,
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
    <div class="u-popup" @click="close">
      <div class="u-popup__wrapper" @click.stop>
        <div class="u-popup__header">
          <button class="u-popup__close" @click="close"></button>
          <p class="u-popup__title">{{ title }}</p>
        </div>
        <div class="u-popup__content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" src="./UPopup.scss" scoped/>