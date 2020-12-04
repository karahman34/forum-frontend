<template>
  <div class="home">
    <!-- Header Text -->
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <!-- Left -->
      <div class="title">
        <i class="fas fa-comment"></i>
        <span class="ml-3">Forum Discussion</span>
      </div>

      <!-- Right -->
      <button class="button is-success has-text-weight-medium">
        <i class="fas fa-plus"></i>
        <span class="ml-2">Create Post</span>
      </button>
    </div>

    <!-- Filter Posts -->
    <filter-posts class="mt-1 mb-3" @filter="filter = $event"></filter-posts>

    <!-- Loading get posts -->
    <template v-if="getPostsLoading && posts === null">
      <div
        class="mt-6 title has-text-centered has-text-weight-medium has-text-grey-dark"
      >
        <i class="fas fa-spinner fa-spin"></i>
        <span class="ml-3">Getting posts...</span>
      </div>
    </template>

    <!-- No result -->
    <div
      class="mt-6 title has-text-centered has-text-weight-medium has-text-grey-dark"
      v-else-if="!getPostsLoading && posts !== null && !posts.length"
    >
      <span class="ml-3">No result, please try with another keywords.</span>
    </div>

    <!-- Posts Lists -->
    <post v-else v-for="post in posts" :key="post.id" :post="post"></post>

    <!-- Pagination -->
    <pagination
      v-model="page"
      v-if="!getPostsLoading && posts !== null && posts.length"
      class="mt-5"
      :total="total"
    ></pagination>
  </div>
</template>

<script>
import postApi from '@/api/postApi'
import Post from '@/components/posts/Feed'
import Filter from '@/components/posts/Filter'
import Pagination from '@/components/Pagination'

export default {
  name: 'Home',

  components: {
    Post,
    Pagination,
    'filter-posts': Filter
  },

  data() {
    return {
      filter: {
        search: null,
        tags: null,
        filter: null
      },
      posts: null,
      page: 1,
      total: null,
      getPostsLoading: false
    }
  },

  watch: {
    filter: {
      deep: true,
      handler() {
        this.posts = null
        this.getPosts()
      }
    }
  },

  mounted() {
    if (!this.posts) {
      this.getPosts()
    }
  },

  methods: {
    async getPosts() {
      this.getPostsLoading = true

      try {
        const res = await postApi.collection({
          page: this.page,
          ...this.filter
        })
        const { ok, data, meta } = res.data

        if (!ok) throw new Error('failed')

        this.posts = data
        this.total = meta.total
      } catch (err) {
        alert('Failed to get posts data, please try again later.')
      } finally {
        this.getPostsLoading = false
      }
    }
  }
}
</script>
