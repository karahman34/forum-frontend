<template>
  <div class="card profile-card">
    <div class="card-content">
      <!-- Header -->
      <div class="mb-3">
        <i class="fas fa-user"></i>
        <span class="ml-3">Profile</span>
      </div>

      <!-- Alert -->
      <alert
        v-if="alert.message"
        class="mb-2"
        :message="alert.message"
        :type="alert.type"
      ></alert>

      <!-- Form -->
      <form @submit.prevent="updateProfile">
        <!-- Username -->
        <div class="field">
          <label for="username" class="label">Username</label>
          <div class="control has-icons-left">
            <input
              id="username"
              type="text"
              class="input"
              :class="{ 'is-danger': errors.username }"
              v-model="form.username"
              placeholder="Username"
            />
            <small class="icon is-left">
              <i class="fas fa-user"></i>
            </small>
          </div>

          <p class="help is-danger" v-if="errors.username">
            {{ errors.username }}
          </p>
        </div>

        <!-- Avatar -->
        <div class="field">
          <label for="avatar" class="label">Avatar</label>
          <div class="control">
            <div class="file is-fullwidth has-name">
              <label class="file-label">
                <input
                  id="avatar"
                  class="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="avatarUploadHandler"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Upload avatar...
                  </span>
                </span>
                <span class="file-name" v-if="upload_avatar_file_name">
                  {{ upload_avatar_file_name }}
                </span>
              </label>
            </div>
          </div>

          <p v-if="errors.avatar" class="help is-danger">
            {{ errors.avatar }}
          </p>
        </div>

        <!-- Preview Avatar -->
        <div v-if="preview_avatar">
          <img class="avatar" :src="preview_avatar" :alt="preview_avatar" />
        </div>

        <!-- Footer -->
        <div class="is-flex is-justify-content-space-between mt-1">
          <button class="button is-info">
            <i class="fas fa-eye"></i>
            <span class="ml-2">My posts</span>
          </button>

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
        avatar: null,
        username: null
      },
      errors: {
        avatar: null,
        username: null
      },
      loading: false,
      preview_avatar: null,
      upload_avatar_file_name: null,
      alert: {
        type: null,
        message: null
      }
    }
  },

  mounted() {
    this.syncUserData()
  },

  methods: {
    syncUserData() {
      // Username
      this.form.username = this.auth.username

      // Avatar
      const avatar = this.auth?.avatar
      if (avatar) {
        this.preview_avatar = avatar
      }
    },
    avatarUploadHandler(event) {
      if (!event.target.files.length) return

      const avatar = event.target.files[0]
      this.form.avatar = avatar
      this.preview_avatar = URL.createObjectURL(avatar)
      this.upload_avatar_file_name = avatar.name
    },
    async updateProfile() {
      this.loading = true
      this.alert = {
        message: null,
        type: null
      }
      hideValidationErrors(this.errors)

      const formData = new FormData()
      formData.append('_method', 'patch')
      formData.append('username', this.form.username)
      formData.append('avatar', this.form.avatar)

      try {
        await profileApi.updateProfile(formData)

        this.$emit('update')
        this.alert = {
          type: 'success',
          message: 'Profile updated.'
        }
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(this.errors, err.response.data)
        } else {
          this.alert = {
            type: 'danger',
            message: 'Failed to update profile.'
          }
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-card {
  .avatar {
    object-fit: cover;
    width: 250px;
    height: 250px;
  }
}
</style>
