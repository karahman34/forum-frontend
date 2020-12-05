<template>
  <div>
    <!-- Delete Post -->
    <div
      v-if="deleteLoading"
      class="has-text-centered title has-text-grey has-text-weight-normal"
    >
      <i class="fas fa-spinner fa-spin"></i>
      <span class="ml-3">Deleting post...</span>
    </div>

    <!-- Loading -->
    <template v-else-if="loading">
      <div
        class="title has-text-grey has-text-centered has-text-weight-medium mt-4"
      >
        <i class="fas fa-spinner fa-spin"></i>
        <span class="ml-3">Getting post data...</span>
      </div>
    </template>

    <!-- Not Found -->
    <div
      v-if="!loading && post === null"
      class="title has-text-grey has-text-centered has-text-weight-medium mt-4"
    >
      <span class="ml-3">Post not found.</span>
    </div>

    <!-- Content -->
    <div v-if="!loading && post !== null" class="columns">
      <div class="column is-9">
        <!-- Post Detail -->
        <post-detail
          :post="post"
          @delete="deletePost"
          @solved="postSolvedHandler"
        ></post-detail>

        <!-- Comments -->
        <comments class="mt-4" :post="post"></comments>
      </div>
      <div class="column is-3">
        <!-- The Meta -->
        <post-meta :post="post"></post-meta>

        <!-- Related Posts -->
        <related-post class="mt-4" :post="post"></related-post>
      </div>
    </div>
  </div>
</template>

<script>
import postApi from '@/api/postApi'
import Comments from '@/components/posts/Comments'
import Detail from '@/components/posts/Detail'
import Meta from '@/components/posts/Meta'
import Related from '@/components/posts/Related'

export default {
  components: {
    Comments,
    'post-detail': Detail,
    'post-meta': Meta,
    'related-post': Related
  },

  data() {
    return {
      post: null,
      loading: false,
      deleteLoading: false
    }
  },

  computed: {
    postId() {
      return this.$route.params.id
    }
  },

  watch: {
    postId: {
      immediate: true,
      handler() {
        this.getPost()
      }
    }
  },

  methods: {
    postSolvedHandler() {
      this.$set(this.post, 'solved', 'Y')
    },
    async getPost() {
      this.loading = true
      try {
        const res = await postApi.show(this.postId)
        const { ok, data } = res.data

        if (!ok) throw new Error()

        this.post = data
      } catch (err) {
        alert('Failed to get post data, please try again later')
      } finally {
        this.loading = false
      }
    },
    async deletePost() {
      const ask = confirm('Are you sure want to delete this post ?')
      if (!ask) return

      this.deleteLoading = true

      try {
        await postApi.delete(this.post.id)

        this.$router.replace({
          name: 'Home'
        })
      } catch (err) {
        alert('Failed to delete post, please try again later.')
      } finally {
        this.deleteLoading = false
      }
    }
  }
}
</script>
