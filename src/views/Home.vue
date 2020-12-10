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
      <router-link
        :to="{ name: 'Post.Create' }"
        class="button is-success has-text-weight-medium"
      >
        <i class="fas fa-plus"></i>
        <span class="ml-2">Create Post</span>
      </router-link>
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
      v-else-if="
        !getPostsLoading && posts[page] !== undefined && !posts[page].length
      "
    >
      <span class="ml-3">No result, please try with another keywords.</span>
    </div>

    <!-- Posts Lists -->
    <post v-else v-for="post in posts[page]" :key="post.id" :post="post"></post>

    <!-- Pagination -->
    <pagination
      v-model="page"
      v-if="!getPostsLoading && !hidePagination && total"
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
      posts: {},
      page: 1,
      total: null,
      getPostsLoading: false,
      hidePagination: null
    }
  },

  watch: {
    filter: {
      deep: true,
      handler() {
        const currentPage = this.page
        this.page = 1
        this.posts = {}

        if (currentPage === 1) {
          this.getPosts()
        }
      }
    },
    page(page) {
      if (!this.posts[page]) {
        return this.getPosts()
      }
    }
  },

  mounted() {
    this.getPosts()
  },

  methods: {
    async getPosts() {
      this.getPostsLoading = true

      try {
        const res = await postApi.collection({
          page: this.page,
          ...this.filter
        })
        const { ok, data, meta, links } = res.data

        if (!ok) throw new Error('failed')

        this.$set(this.posts, this.page, data)
        this.total = meta.total
        this.hidePagination = !links.next && !links.prev ? true : false
      } catch (err) {
        alert('Failed to get posts data, please try again later.')
      } finally {
        this.getPostsLoading = false
      }
    }
  }
}
</script>
