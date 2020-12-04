<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-content">
          <!-- Header Text -->
          <div class=" mb-3 subtitle">
            Select Tags
          </div>

          <!-- Search Tags -->
          <div class="field">
            <div class="control has-icons-left">
              <input
                v-model="search"
                type="text"
                class="input"
                placeholder="Search.."
              />
              <span class="icon is-small is-left">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>

          <!-- Loading -->
          <div class="has-text-centered" v-if="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span class="ml-2">Gettings tags...</span>
          </div>

          <!-- Tags -->
          <span
            v-else
            class="tag is-info mb-2 mr-2"
            :class="{ 'is-light': !selectedTagsLocal.includes(tag) }"
            v-for="tag in filteredTags"
            :key="tag"
            @click="tagClickHandler(tag)"
          >
            {{ tag }}
          </span>

          <!-- Footer -->
          <div class="is-flex is-justify-content-space-between mt-3">
            <!-- Reset -->
            <button class="button is-danger" @click="reset">
              Reset
            </button>

            <div>
              <!-- Close -->
              <button class="button is-light mr-4" @click="close">
                Cancel
              </button>
              <!-- Save -->
              <button class="button is-info" @click="selectTags">Select</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="close"
    ></button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    selectedTags: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      search: null,
      selectedTagsLocal: []
    }
  },

  computed: {
    ...mapState({
      tags: state => state.tags
    }),
    filteredTags() {
      return this.search !== null && this.search.length
        ? this.tags.filter(tag => tag.includes(this.search))
        : this.tags
    }
  },

  mounted() {
    if (this.tags === null) {
      this.getTags()
    }

    if (this.selectedTags !== null)
      this.selectedTagsLocal = [...this.selectedTags]
  },

  methods: {
    ...mapActions({
      getTagsAction: 'getTags'
    }),
    close() {
      this.$emit('close')
    },
    tagClickHandler(tag) {
      if (this.selectedTagsLocal.includes(tag)) {
        this.selectedTagsLocal.splice(this.selectedTagsLocal.indexOf(tag), 1)
      } else {
        this.selectedTagsLocal.push(tag)
      }
    },
    async getTags() {
      this.loading = true

      try {
        await this.getTagsAction()
      } catch (err) {
        alert('Failed to get tags, please try again later.')
      } finally {
        this.loading = false
      }
    },
    selectTags() {
      this.$emit('save', this.selectedTagsLocal)

      this.close()
    },
    reset() {
      this.selectedTagsLocal = []
      this.selectTags()
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  cursor: pointer;
}
</style>
