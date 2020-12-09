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

    <!-- Infinite Loading -->
    <vue-infinite-loading @infinite="getPosts"></vue-infinite-loading>
  </div>
</template>

<script>
import profileApi from '@/api/profileApi'
import Feed from '@/components/posts/Feed'
import VueInfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    'post-feed': Feed,
    VueInfiniteLoading
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      page: 1,
      posts: []
    }
  },

  methods: {
    async getPosts($state) {
      try {
        const res = await profileApi.getPosts(this.user.username, {
          page: this.page
        })
        const { data, links } = res.data

        this.posts.push(...data)

        if (links.next) {
          this.page += 1
          $state.loaded()
        } else {
          $state.complete()
        }
      } catch (err) {
        alert('Failed to get user posts.')
      }
    }
  }
}
</script>
