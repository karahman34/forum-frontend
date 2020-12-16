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
import PostLayout from '@/layouts/post/Template'

export default {
  components: {
    AuthLayout,
    DefaultLayout,
    PostLayout
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
