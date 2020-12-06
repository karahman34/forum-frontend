<template>
  <div class="card">
    <div class="card-content">
      <!-- Header -->
      <div class="mb-3">
        <i class="fas fa-envelope"></i>
        <span class="ml-3">Email</span>
      </div>

      <!-- Alert -->
      <alert
        v-if="alert.message"
        class="mb-2"
        :message="alert.message"
        :type="alert.type"
      ></alert>

      <!-- Form -->
      <form @submit.prevent="update">
        <!-- Email -->
        <div class="field">
          <label for="email" class="label">Email</label>
          <div class="control has-icons-left">
            <input
              v-model="form.email"
              type="text"
              class="input"
              :class="{ 'is-danger': errors.email }"
              placeholder="Email"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
          <p class="is-danger help" v-if="errors.email">{{ errors.email }}</p>
        </div>

        <div class="is-flex is-justify-content-flex-end">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': loading }"
            :disabled="loading || auth.email === form.email"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
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
      alertMessage: null,
      form: {
        email: null
      },
      errors: {
        email: null
      },
      loading: false,
      alert: {
        type: null,
        message: null
      }
    }
  },

  mounted() {
    this.form.email = this.auth.email
  },

  methods: {
    async update() {}
  }
}
</script>
