<script>
  export default {
    beforeCreate() {
      const resize = () => {
        document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`)
      }
      resize()

      window.addEventListener('resize', resize)
    }
  }
</script>

<template>
    <router-view></router-view>
</template>
