<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-half-desktop">
        <!-- Header Text -->
        <div class="has-text-centered">
          <p class="title mb-0">Welcome,</p>
          <span class="has-text-grey subtitle ml-2"
            >Please enter your username and password.</span
          >
        </div>

        <!-- The Card -->
        <div class="card mt-3">
          <div class="card-content">
            <!-- Alert -->
            <alert
              v-if="alertError"
              class="mb-2"
              type="danger"
              :message="alertError"
            ></alert>

            <!-- The Form -->
            <form @submit.prevent="goLogin">
              <!-- Username -->
              <div class="field">
                <label class="label">Email / Username</label>
                <div class="control has-icons-left">
                  <input
                    v-model="form.email_or_username"
                    class="input"
                    :class="{
                      'is-danger': form_errors.email_or_username !== null
                    }"
                    type="text"
                    placeholder="Email or Username"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
                <p class="help is-danger" v-if="form_errors.email_or_username">
                  {{ form_errors.email_or_username }}
                </p>
              </div>

              <!-- Password -->
              <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.password"
                    class="input"
                    :class="{
                      'is-danger': form_errors.password
                    }"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                  <span
                    class="icon is-small is-right"
                    style="cursor: pointer; pointer-events: initial"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      class="fas"
                      :class="[showPassword ? 'fa-eye' : 'fa-eye-slash']"
                    ></i>
                  </span>
                </div>
                <!-- Help Block -->
                <div class="help columns is-mobile">
                  <!-- Help Message -->
                  <div class="column is-half">
                    <p class="help is-danger" v-if="form_errors.password">
                      {{ form_errors.password }}
                    </p>
                  </div>

                  <!-- Forgot Passowrd -->
                  <div class="column is-half">
                    <div class="is-flex is-justify-content-flex-end">
                      <a href="#" class="mt-1">Forgot Password ?</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Login Button -->
              <button
                type="submit"
                class="button is-success is-fullwidth"
                :class="{ 'is-loading': loading }"
                :disabled="loading"
              >
                Login
              </button>

              <!-- Register Anchor -->
              <p class="mb-0 mt-2">
                You dont have an account ?
                <router-link :to="{ name: 'Register' }">Register</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { hideValidationErrors, showValidationErrors } from '@/helpers/form'
import Alert from '@/components/Alert'

export default {
  components: {
    Alert
  },

  data() {
    return {
      form: {
        email_or_username: null,
        password: null
      },
      form_errors: {
        email_or_username: null,
        password: null
      },
      loading: false,
      showPassword: false,
      alertError: null
    }
  },

  methods: {
    ...mapActions('auth', {
      loginAction: 'login'
    }),
    async goLogin() {
      hideValidationErrors(this.form_errors)
      this.loading = true
      this.alertError = null

      try {
        // Dispatch vuex action
        await this.loginAction(this.form)

        const redirectUrl = this.$route.query.from || { name: 'Home' }

        const routerData = this.$router.resolve(redirectUrl)
        window.location.href = routerData.href
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(this.form_errors, err.response.data)
        } else if (errCode === 401) {
          this.alertError = err.response.data.message
        } else {
          this.alertError =
            'Failed to authenticate user, please try again later.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
