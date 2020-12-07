<template>
  <div class="modal is-active">
    <div class="modal-background" @click="closeDialog"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-content">
          <!-- Account Detail -->
          <div class="columns is-mobile">
            <div class="column is-3">
              <!-- Avatar -->
              <img :src="user.avatar" :alt="user.avatar" />
            </div>

            <div class="column is-9">
              <!-- Username -->
              <p class="title mb-0">@{{ user.username }}</p>

              <!-- Bio -->
              <p class="bio mt-2">{{ user.bio || 'No bio.' }}</p>
            </div>
          </div>

          <!-- Posts -->
          <posts :user="user"></posts>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="closeDialog"
    ></button>
  </div>
</template>

<script>
import Posts from '@/components/profile/Posts'

export default {
  components: {
    posts: Posts
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
