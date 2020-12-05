<template>
  <!-- Form Dialog -->
  <div class="modal is-active">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-content">
          <!-- Header -->
          <div class="subtitle is-flex is-justify-content-space-between">
            <span>{{ !isEdit ? 'Create' : 'Edit' }} Comment</span>
            <span class="pointer" @click="closeModal">
              <i class="fas fa-times-circle"></i>
            </span>
          </div>

          <!-- The Form -->
          <form @submit.prevent="formSubmitHandler">
            <!-- Editor -->
            <vue-editor
              v-model="form.body"
              placeholder="Comment text.."
              class="mt-4"
              :editor-toolbar="customToolbar"
            ></vue-editor>

            <!-- Validation Error Message -->
            <small class="has-text-danger" v-if="formError">{{
              formError
            }}</small>

            <!-- Footer -->
            <div class="is-flex is-justify-content-flex-end mt-2">
              <!-- Close -->
              <button class="button is-light" @click="closeModal">Close</button>

              <!-- Submit -->
              <button
                type="submit"
                class="button is-link ml-4"
                :class="{ 'is-loading': loading }"
                :disabled="loading"
              >
                {{ !isEdit ? 'Create' : 'Edit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="closeModal"
    ></button>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import commentApi from '@/api/commentApi'

export default {
  components: {
    VueEditor
  },

  props: {
    comment: {
      type: Object,
      default: null
    },
    postId: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    return {
      form: {
        body: null
      },
      formError: null,
      loading: false,
      isWriting: false,
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
      ]
    }
  },

  computed: {
    isEdit() {
      return this.comment !== null
    }
  },

  watch: {
    'form.body': {
      handler(val, old) {
        if (val !== old) {
          this.isWriting = true
        }
      }
    }
  },

  mounted() {
    if (this.isEdit) {
      this.form.body = this.comment.body
      this.$nextTick(() => (this.isWriting = false))
    }
  },

  methods: {
    closeModal() {
      if (this.isWriting) {
        const answer = confirm('Changes you made may not be saved.')

        if (answer) this.$emit('close')
      } else {
        this.$emit('close')
      }
    },
    resetForm() {
      this.form.body = null
      this.isWriting = false
    },
    formSubmitHandler() {
      this.loading = true

      return this.isEdit ? this.updateComment() : this.addComment()
    },
    async addComment() {
      try {
        await commentApi.create({
          body: this.form.body,
          _post_id: this.postId
        })

        this.$emit('created')
        this.resetForm()
        this.closeModal()
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          this.formError = err.response.data.body[0]
        } else {
          alert('Failed to create comment, please try again later.')
        }
      } finally {
        this.loading = false
      }
    },
    async updateComment() {
      try {
        await commentApi.update(this.comment.id, this.form)

        this.$emit('updated')
        this.resetForm()
        this.closeModal()
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          this.formError = err.response.data.body[0]
        } else {
          alert('Failed to update comment, please try again later.')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
