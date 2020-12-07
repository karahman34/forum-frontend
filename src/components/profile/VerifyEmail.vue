<template>
  <alert class="mb-2" :type="type" :message="message" v-if="!verified">
    <span
      style="text-decoration: underline"
      class="is-clickable ml-1"
      @click="resendVerifyEmail"
    >
      <template v-if="!resendEmailLoading">
        Resend email
      </template>
      <template v-else>
        Sending...
      </template>
    </span>
  </alert>
</template>

<script>
import Alert from '@/components/Alert'
import singleApi from '@/api/singleApi'

export default {
  components: {
    Alert
  },

  props: {
    verified: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      resendEmailLoading: false,
      type: 'warning',
      // eslint-disable-next-line prettier/prettier
      message: 'You still haven\'t verify your email.',
    }
  },

  methods: {
    async resendVerifyEmail() {
      this.resendEmailLoading = true

      try {
        await singleApi.sendVerifyEmail()

        this.type = 'success'
        this.message =
          'Success to send verify email address, please check your email.'
      } catch (err) {
        this.type = 'danger'
        this.message = 'Failed to resend verify email address.'
      } finally {
        this.resendEmailLoading = false
      }
    }
  }
}
</script>
