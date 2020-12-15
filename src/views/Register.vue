<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-half-desktop">
        <!-- Header Text -->
        <div class="has-text-centered">
          <p class="title mb-0">Create an account.</p>
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
            <form @submit.prevent="goRegister">
              <!-- E-Mail -->
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                  <input
                    v-model="form.email"
                    class="input"
                    :class="{
                      'is-danger': form_errors.email !== null
                    }"
                    type="email"
                    placeholder="Email"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
                <p class="help is-danger" v-if="form_errors.email">
                  {{ form_errors.email }}
                </p>
              </div>

              <!-- Username -->
              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left">
                  <input
                    v-model="form.username"
                    class="input"
                    :class="{
                      'is-danger': form_errors.username !== null
                    }"
                    type="text"
                    placeholder="Username"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
                <p class="help is-danger" v-if="form_errors.username">
                  {{ form_errors.username }}
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
                <p class="help is-danger" v-if="form_errors.password">
                  {{ form_errors.password }}
                </p>
              </div>

              <!-- Password Confirmation -->
              <div class="field">
                <label class="label">Password Confirmation</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.password_confirmation"
                    class="input"
                    :type="showPasswordConfirmation ? 'text' : 'password'"
                    placeholder="Password"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                  <span
                    class="icon is-small is-right"
                    style="cursor: pointer; pointer-events: initial"
                    @click="
                      showPasswordConfirmation = !showPasswordConfirmation
                    "
                  >
                    <i
                      class="fas"
                      :class="[
                        showPasswordConfirmation ? 'fa-eye' : 'fa-eye-slash'
                      ]"
                    ></i>
                  </span>
                </div>
              </div>

              <!-- Register Button -->
              <button
                type="submit"
                class="button is-success is-fullwidth"
                :class="{ 'is-loading': loading }"
                :disabled="loading"
              >
                Register
              </button>

              <!-- Register Anchor -->
              <p class="mb-0 mt-2">
                Already have an account ?
                <router-link :to="{ name: 'Login' }">Login</router-link>
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
        email: null,
        username: null,
        password: null,
        password_confirmation: null
      },
      form_errors: {
        email: null,
        username: null,
        password: null
      },
      loading: false,
      showPassword: false,
      showPasswordConfirmation: false,
      alertError: null
    }
  },

  methods: {
    ...mapActions('auth', {
      registerAction: 'register'
    }),
    async goRegister() {
      hideValidationErrors(this.form_errors)
      this.loading = true
      this.alertError = null

      try {
        // Dispatch vuex action
        await this.registerAction(this.form)

        window.location.href = '/'
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(this.form_errors, err.response.data)
        } else {
          this.alertError = 'Failed to register user, please try again later.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
