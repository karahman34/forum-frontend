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
section.section {
  background-color: #f3f3f3;
}
</style>
