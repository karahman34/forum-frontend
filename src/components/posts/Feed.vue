<template>
  <div class="card post-feed">
    <div class="card-content py-4">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap"
      >
        <!-- Left -->
        <div>
          <!-- Header -->
          <div style="font-size:16">
            <!-- Created Time -->
            <span class="has-text-grey"> Posted at {{ postedTime }}</span>

            <!-- Username -->
            <span>
              by
              <span class="has-text-weight-bold has-text-grey-dark">{{
                post.author.username
              }}</span>
            </span>
          </div>

          <!-- Title -->
          <router-link
            :to="{
              name: 'Post',
              params: { id: post.id, slug: post.title.replace(/\//g, '-') }
            }"
            class="is-block subtitle mb-1"
            >{{ post.title }}</router-link
          >

          <!-- Tags -->
          <span
            class="mr-2 tag is-info is-light"
            v-for="tag in post.tags"
            :key="tag"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Right -->
        <div class="is-flex is-align-items-center">
          <!-- Views -->
          <span>
            <i class="fas fa-eye"></i>
            {{ post.views }} views
          </span>

          <!-- Comments -->
          <span class="mx-3">
            <i class="fas fa-comments"></i>
            {{ post.comments_count }} comments
          </span>

          <!-- Status -->
          <span
            class="button is-light"
            :class="[solved ? 'is-success' : 'is-danger']"
          >
            <i class="fas" :class="[solved ? 'fa-check' : 'fa-times']"></i>
            <span class="ml-2">{{ solved ? 'Solved' : 'Unsolved' }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },

  computed: {
    solved() {
      return this.post.solved.toLowerCase() === 'y'
    },
    postedTime() {
      return moment(this.post.created_at).fromNow()
    }
  }
}
</script>

<style lang="scss" scoped>
.post-feed {
  border: 1px solid rgba(128, 128, 128, 0.2);
}
</style>
