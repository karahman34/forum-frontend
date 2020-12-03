<template>
  <div>
    <!-- Navbar -->
    <nav-bar></nav-bar>

    <section class="section">
      <div class="container">
        <!-- Router View -->
        <slot></slot>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from './_NavBar'

export default {
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
html,
body {
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
}
</style>
