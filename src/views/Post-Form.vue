<template>
  <div>
    <!-- Loading -->
    <template v-if="getPostLoading">
      <div
        class="has-text-centered has-text-weight-normal has-text-grey-dark title mb-0 mt-4"
      >
        <i class="fas fa-spinner fa-spin"></i>
        <span class="ml-3">Getting Post...</span>
      </div>
    </template>

    <template v-else>
      <!-- Header Text -->
      <div class="title mb-3 has-text-centered has-text-weight-normal">
        <i class="fas" :class="[isEdit ? 'fa-pencil-alt' : 'fa-plus']"></i>
        <span class="ml-3">{{ isEdit ? 'Edit' : 'Create' }} Post</span>
      </div>

      <!-- Main Content -->
      <div class="columns is-centered">
        <div class="column is-half-desktop">
          <!-- The Form -->
          <form @submit.prevent="formSubmitHandler">
            <!-- Title -->
            <div class="field">
              <label for="title" class="label">Title</label>
              <div class="control">
                <input
                  id="title"
                  type="text"
                  class="input"
                  v-model="form.title"
                  placeholder="Title"
                />
              </div>

              <p v-if="errors.title" class="help is-danger">
                {{ errors.title }}
              </p>
            </div>

            <!-- Body -->
            <div class="field">
              <label class="label">Body</label>
              <div class="control">
                <vue-editor
                  v-model="form.body"
                  class="has-background-white"
                  placeholder="Body"
                ></vue-editor>
              </div>

              <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
            </div>

            <!-- Tags -->
            <div class="field">
              <label class="label">Tags</label>
              <div class="control">
                <tags-input :tags="form.tags" v-model="form.tags"></tags-input>
              </div>

              <p v-if="errors.tags" class="help is-danger">{{ errors.tags }}</p>
            </div>

            <!-- Screenshots -->
            <div class="field">
              <label for="screenshots" class="label">Screenshots</label>
              <div class="control">
                <div class="file is-fullwidth">
                  <label class="file-label">
                    <input
                      id="screenshots"
                      class="file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      @change="imageUploadHandler"
                    />
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Add screenshots...
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <p v-if="errors.screenshots" class="help is-danger">
                {{ errors.screenshots }}
              </p>
            </div>

            <!-- Preview Screenshots -->
            <div v-if="preview_screenshots.length" class="mt-2">
              <div
                v-for="preview_screenshot in preview_screenshots"
                :key="preview_screenshot"
                class="my-2 preview-container"
              >
                <img :src="preview_screenshot" class="is-block image" />
                <button
                  class="button is-light delete-button"
                  @click="deleteImage(preview_screenshot)"
                >
                  <i class="fas fa-times"></i>
                  <span class="ml-2">Delete</span>
                </button>
              </div>
            </div>

            <!-- Footer -->
            <button
              class="button is-info is-fullwidth mt-1"
              :class="{ 'is-loading': loading }"
              :disabled="loading"
            >
              {{ !isEdit ? 'Create' : 'Update' }}
            </button>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { hideValidationErrors, showValidationErrors } from '@/helpers/form'
import postApi from '@/api/postApi'
import TagsInput from '@/components/TagsInput'

export default {
  components: {
    VueEditor,
    TagsInput
  },

  data() {
    return {
      customToolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        ['blockquote', 'code-block', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '-1' }, { indent: '+1' }]
      ],
      form: {
        title: null,
        body: null,
        tags: [],
        screenshots: []
      },
      errors: {
        title: null,
        body: null,
        tags: null,
        screenshots: null
      },
      preview_screenshots: [],
      loading: false,
      isEdit: false,
      post: null,
      getPostLoading: false
    }
  },

  computed: {
    postId() {
      return this.$route.params?.id || null
    }
  },

  mounted() {
    if (this.postId) {
      this.isEdit = true
      this.getPost()
    }
  },

  methods: {
    imageUploadHandler(event) {
      const images = event.target.files

      if (!images.length) return

      for (const image of images) {
        this.preview_screenshots.push(URL.createObjectURL(image))
        this.form.screenshots.push(image)
      }
    },
    deleteImage(preview_screenshot) {
      const index = this.preview_screenshots.indexOf(preview_screenshot)
      this.preview_screenshots.splice(index, 1)
      this.form.screenshots.splice(index, 1)
    },
    formSubmitHandler() {
      // Set Loading
      this.loading = true

      // Make payload
      const payload = new FormData()
      for (const key in this.form) {
        const field = this.form[key]

        if (key === 'tags') {
          field.forEach((tag, i) => payload.append(`tags[${i}]`, tag.text))
        } else if (key === 'screenshots') {
          const old_screenshots = []

          for (let i = 0; i < field.length; i++) {
            const screenshot = field[i]
            if (typeof screenshot === 'string') {
              // Remove the old screenshot
              old_screenshots.push(screenshot)
            } else {
              // Set Screenshots
              payload.append(`screenshots[${i}]`, screenshot)
            }
          }

          // Pair old screenshots
          for (let i = 0; i < old_screenshots.length; i++) {
            const old_screenshot = old_screenshots[i]
            payload.append(`old_screenshots[${i}]`, old_screenshot)
          }
        } else {
          if (field !== null && field.length) {
            payload.append(key, field)
          }
        }
      }

      if (this.isEdit) {
        payload.append('_method', 'patch')
      }

      return !this.isEdit ? this.createPost(payload) : this.updatePost(payload)
    },
    async getPost() {
      this.getPostLoading = true

      try {
        const res = await postApi.show(this.postId)
        const { data } = res.data

        this.post = data

        // Sync post values
        Object.keys(this.form).forEach(field => {
          const postProperty = this.post[field]
          if (postProperty) {
            if (!['tags', 'screenshots'].includes(field)) {
              this.form[field] = postProperty
            } else if (field === 'tags') {
              this.form.tags = postProperty.map(tag => ({ text: tag }))
            } else {
              const screenshots = postProperty
              screenshots.forEach(screenshot => {
                this.form.screenshots.push(screenshot.original)
                this.preview_screenshots.push(screenshot.url)
              })
            }
          }
        })
      } catch (err) {
        alert('Failed to get post data.')
      } finally {
        this.getPostLoading = false
      }
    },
    async createPost(payload) {
      hideValidationErrors(this.errors)

      try {
        const res = await postApi.create(payload)
        const { data } = res.data

        this.$router.push({
          name: 'Post',
          params: {
            id: data.id,
            slug: data.title.replace(/ /g, ' ')
          }
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(this.errors, err.response.data)
        } else {
          alert('Failed to create post, please try again later.')
        }
      } finally {
        this.loading = false
      }
    },
    async updatePost(payload) {
      hideValidationErrors(this.errors)

      try {
        const res = await postApi.update(this.post.id, payload)
        const { data } = res.data

        this.$router.push({
          name: 'Post',
          params: {
            id: data.id,
            slug: data.title.replace(/ /g, ' ')
          }
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(this.errors, err.response.data)
        } else {
          alert('Failed to update post, please try again later.')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  position: relative;

  .image {
    transition: filter 0.5s;
  }

  .delete-button {
    display: none;
    position: absolute;
    right: 3%;
    bottom: 5%;
  }

  &:hover {
    .image {
      -webkit-filter: brightness(70%);
      filter: brightness(70%);
    }

    .delete-button {
      display: inline-block;
    }
  }
}
</style>
