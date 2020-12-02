<template>
  <div id="app">
    <!-- Layout -->
    <component :is="layout">
      <!-- Router View -->
      <router-view />
    </component>
  </div>
</template>

<script>
import AuthLayout from '@/layouts/auth/Template'
import DefaultLayout from '@/layouts/default/Template'

export default {
  components: {
    AuthLayout,
    DefaultLayout
  },

  computed: {
    layout() {
      const layoutName = this.$route.meta?.layout

      return !layoutName ? 'default-layout' : `${layoutName}-layout`
    }
  }
}
</script>

<style lang="scss">
@import './assets/sass/app';
</style>
