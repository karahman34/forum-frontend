<template>
  <div class="page-error mt-6 has-text-centered">
    <div class="title has-text-weight-normal has-text-grey-dark">
      <!-- Code -->
      <span>{{ errCode }}</span>

      <!-- Message -->
      <span class="ml-3">{{ message }}</span>
    </div>

    <router-link class="button is-white" :to="{ name: 'Home' }">
      <i class="fas fa-arrow-left"></i>
      <span class="ml-2">Back Home</span>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    errCode() {
      return parseInt(this.$route.params.code)
    },
    message() {
      let message

      if (this.errCode === 401) {
        message = 'Unauthorized.'
      } else if (this.errCode === 403) {
        message = 'Forbidden.'
      } else if (this.errCode === 500) {
        message = 'Internal Server Error'
      }

      return message
    }
  }
}
</script>
