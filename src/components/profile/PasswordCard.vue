<template>
  <div class="card">
    <div class="card-content">
      <!-- Header -->
      <div class="mb-3">
        <i class="fas fa-lock"></i>
        <span class="ml-3">Password</span>
      </div>

      <!-- Alert -->
      <alert
        v-if="alert.message"
        class="mb-2"
        :message="alert.message"
        :type="alert.type"
      ></alert>

      <!-- Form -->
      <form @submit.prevent="updatePassword">
        <!-- Old Password -->
        <div class="field">
          <label for="old_password" class="label">Old Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              id="old_password"
              v-model="form.old_password"
              class="input"
              :class="{ 'is-danger': errors.old_password }"
              placeholder="Old Password"
              :type="showOldPassword ? 'text' : 'password'"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <span
              class="icon is-small is-right"
              style="cursor: pointer; pointer-events: initial"
              @click="showOldPassword = !showOldPassword"
            >
              <template v-if="showOldPassword">
                <span>
                  <i class="fas fa-eye"></i>
                </span>
              </template>

              <template v-if="!showOldPassword">
                <span>
                  <i class="fas fa-eye-slash"></i>
                </span>
              </template>
            </span>
          </div>
          <p class="help is-danger" v-if="errors.old_password">
            {{ errors.old_password }}
          </p>
        </div>

        <!-- Password -->
        <div class="field">
          <label for="password" class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              id="password"
              v-model="form.password"
              class="input"
              :class="{ 'is-danger': errors.password }"
              placeholder="Password"
              :type="showPassword ? 'text' : 'password'"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <span
              class="icon is-small is-right"
              style="cursor: pointer; pointer-events: initial"
              @click="showPassword = !showPassword"
            >
              <template v-if="showPassword">
                <span>
                  <i class="fas fa-eye"></i>
                </span>
              </template>

              <template v-if="!showPassword">
                <span>
                  <i class="fas fa-eye-slash"></i>
                </span>
              </template>
            </span>
          </div>
          <p class="help is-danger" v-if="errors.password">
            {{ errors.password }}
          </p>
        </div>

        <!-- Password Confirmation -->
        <div class="field">
          <label for="password_confirmation" class="label"
            >Password Confirmation</label
          >
          <div class="control has-icons-left has-icons-right">
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              class="input"
              placeholder="Old Password"
              :type="showPasswordConfirmation ? 'text' : 'password'"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <span
              class="icon is-small is-right"
              style="cursor: pointer; pointer-events: initial"
              @click="showPasswordConfirmation = !showPasswordConfirmation"
            >
              <template v-if="showPasswordConfirmation">
                <span>
                  <i class="fas fa-eye"></i>
                </span>
              </template>

              <template v-if="!showPasswordConfirmation">
                <span>
                  <i class="fas fa-eye-slash"></i>
                </span>
              </template>
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="is-flex is-justify-content-flex-end">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': loading }"
            :disabled="loading"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { hideValidationErrors, showValidationErrors } from '@/helpers/form'
import profileApi from '@/api/profileApi'
import Alert from '@/components/Alert'

export default {
  components: {
    Alert
  },

  props: {
    auth: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      form: {
        old_password: null,
        password: null,
        password_confirmation: null
      },
      errors: {
        old_password: null,
        password: null
      },
      alert: {
        type: null,
        message: null
      },
      loading: false,
      showPassword: false,
      showOldPassword: false,
      showPasswordConfirmation: false
    }
  },

  methods: {
    async updatePassword() {
      this.loading = true
      this.alert = {
        type: null,
        message: null
      }
      hideValidationErrors(this.errors)

      try {
        await profileApi.updatePassword({
          _method: 'patch',
          ...this.form
        })

        this.$emit('update')

        this.alert = {
          type: 'success',
          message: 'Password changed.'
        }
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(this.errors, err.response.data)
        } else if (errCode === 401) {
          this.alert = {
            type: 'danger',
            message: err.response.data?.message || 'Unauthorized.'
          }
        } else {
          this.alert = {
            type: 'danger',
            message: err.response.data?.message || 'Failed to update password.'
          }
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
