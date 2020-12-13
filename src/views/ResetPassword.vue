<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-half-desktop">
        <!-- Alert -->
        <alert
          v-if="alert.message"
          class="mb-3"
          :message="alert.message"
          :light="false"
          :type="alert.error ? 'danger' : 'success'"
        ></alert>

        <!-- The Card -->
        <div class="card">
          <div class="card-content">
            <!-- Header -->
            <div class="subtitle mb-3">
              <i class="fas fa-lock"></i>
              <span class="ml-2">Reset Password</span>
            </div>

            <!-- The Form -->
            <form @submit.prevent="sendResetPassword">
              <!-- Email -->
              <div class="field">
                <label for="email" class="label">Email</label>
                <div class="control has-icons-left">
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="input"
                    :class="{ 'is-danger': error }"
                    placeholder="Email"
                  />
                  <span class="icon is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>

                <p v-if="error" class="help is-danger">{{ error }}</p>
              </div>

              <!-- Button Submit -->
              <button
                type="submit"
                class="button is-info is-fullwidth mb-1"
                :class="{ 'is-loading': loading }"
                :disabled="loading"
              >
                Send Reset Password Mail
              </button>

              <small>
                <router-link :to="{ name: 'Login' }"
                  >Back to login page</router-link
                >
              </small>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import singleApi from '@/api/singleApi'
import Alert from '@/components/Alert'

export default {
  components: {
    Alert
  },

  data() {
    return {
      form: {
        email: null
      },
      error: null,
      alert: {
        error: false,
        message: null
      },
      loading: false
    }
  },

  methods: {
    async sendResetPassword() {
      this.loading = true
      this.error = null
      this.alert = {
        error: false,
        message: null
      }

      try {
        await singleApi.sendResetPasswordMail(this.form)

        this.alert = {
          message:
            'Success to send reset password mail, please check your email.'
        }

        this.form.email = null
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          this.error = err.response.data.email[0]
        } else {
          this.alert = {
            error: true,
            message:
              err?.response?.data?.message ||
              'Failed to send reset password mail.'
          }
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
