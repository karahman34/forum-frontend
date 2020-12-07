<template>
  <div>
    <!-- Unverified Email Alert -->
    <verify-email :verified="verified"></verify-email>

    <!-- Main Content -->
    <div class="card profile-card">
      <div class="card-content">
        <!-- Header -->
        <div
          class="mb-3 is-flex is-justify-content-space-between is-align-items-center"
        >
          <!-- Title Card -->
          <div>
            <i class="fas fa-user"></i>
            <span class="ml-3">Profile</span>
          </div>

          <!-- My Posts Button -->
          <button
            class="button is-info is-rounded has-text-weight-medium"
            style="font-size: 0.85rem;"
          >
            <i class="fas fa-eye"></i>
            <span class="ml-2">My Posts</span>
          </button>
        </div>

        <!-- Alert -->
        <alert
          v-if="alert.message"
          class="mb-2"
          :type="alert.type"
          :message="alert.message"
        ></alert>

        <!-- Form -->
        <form @submit.prevent="updateProfile">
          <!-- Email -->
          <div class="field">
            <label for="email" class="label">Email</label>
            <div class="control has-icons-left">
              <input
                id="email"
                type="email"
                class="input"
                :class="{ 'is-danger': errors.email }"
                v-model="form.email"
                placeholder="Email"
                :disabled="!verified"
              />
              <small class="icon is-left">
                <i class="fas fa-envelope"></i>
              </small>
            </div>

            <p class="help is-danger" v-if="errors.email">
              {{ errors.email }}
            </p>
          </div>

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

          <!-- Bio -->
          <div class="field">
            <label class="label">Bio</label>
            <div class="control">
              <textarea
                v-model="form.bio"
                class="textarea"
                :class="{ 'is-danger': errors.bio }"
                placeholder="Bio"
              ></textarea>
            </div>
            <p class="help is-danger" v-if="errors.bio">
              {{ errors.bio }}
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
          <div class="is-flex is-justify-content-flex-end mt-1">
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
  </div>
</template>

<script>
import { hideValidationErrors, showValidationErrors } from '@/helpers/form'
import profileApi from '@/api/profileApi'
import Alert from '@/components/Alert'
import VerifyEmail from './VerifyEmail.vue'

export default {
  components: {
    Alert,
    VerifyEmail
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
        email: null,
        avatar: null,
        username: null,
        bio: null
      },
      errors: {
        email: null,
        avatar: null,
        username: null,
        bio: null
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

  computed: {
    verified() {
      return this.auth.verified_at !== null
    }
  },

  mounted() {
    this.syncUserData()
  },

  methods: {
    syncUserData() {
      this.form.bio = this.auth.bio
      this.form.email = this.auth.email
      this.form.username = this.auth.username

      // Avatar
      const avatar = this.auth?.avatar
      if (avatar && !avatar.includes('/avatars/default.png')) {
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
        type: null,
        message: null
      }
      hideValidationErrors(this.errors)

      const formData = new FormData()
      formData.append('_method', 'patch')
      formData.append('username', this.form.username)
      if (this.form.bio !== null) formData.append('bio', this.form.bio)
      if (this.form.avatar !== null) formData.append('avatar', this.form.avatar)

      if (this.verified) {
        formData.append('email', this.form.email)
      }

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
            message: err?.response?.data?.message || 'Failed to update profile.'
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
