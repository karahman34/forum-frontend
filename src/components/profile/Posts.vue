<template>
  <div>
    <!-- Post Lists -->
    <template v-if="posts !== null && posts.length">
      <post-feed
        v-for="post in posts"
        :key="post.id"
        class="my-2"
        :post="post"
      ></post-feed>
    </template>

    <!-- Loading -->
    <template v-if="getPostsLoading">
      <center>
        <span
          class="subtitle my-3 has-text-centered has-text-grey is-inline-block"
        >
          <i class="fas fa-spinner fa-spin"></i>
          <span class="ml-2">Getting posts...</span>
        </span>
      </center>
    </template>
  </div>
</template>

<script>
import profileApi from '@/api/profileApi'
import Feed from '@/components/posts/Feed'

export default {
  components: {
    'post-feed': Feed
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      posts: null,
      getPostsLoading: false
    }
  },

  mounted() {
    this.getPosts()
  },

  methods: {
    async getPosts() {
      this.getPostsLoading = true

      try {
        const res = await profileApi.getPosts(this.user.username)
        const { data } = res.data

        this.posts = data
      } catch (err) {
        alert('Failed to get user posts.')
      } finally {
        this.getPostsLoading = false
      }
    }
  }
}
</script>
