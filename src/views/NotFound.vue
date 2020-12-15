<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.$router.replace({
      name: 'Page.Error',
      params: {
        code: 404
      }
    })
  }
}
</script>
