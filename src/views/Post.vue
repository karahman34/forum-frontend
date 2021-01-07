<template>
  <div>
    <!-- Delete Post Loading -->
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
          :total-comments="total_comments"
          @delete="deletePost"
          @solved="postSolvedHandler"
          @open-profile="openProfileDialog = true"
        ></post-detail>

        <!-- Comments -->
        <comments
          class="mt-4"
          :class="{ 'is-hidden': hideComments }"
          :post="post"
          :total-comments="total_comments"
          @total-comments="total_comments = $event"
        ></comments>

        <!-- Show Comment -->
        <button
          class="button mt-5 is-info is-fullwidth"
          v-if="hideComments"
          @click="hideComments = false"
        >
          <span class="icon">
            <i class="fas fa-eye"></i>
          </span>
          <span>Show Comments</span>
        </button>
      </div>
      <div class="column is-3">
        <!-- Related Posts -->
        <related-post :post="post"></related-post>
      </div>
    </div>

    <!-- Profile Dialog -->
    <profile-dialog
      v-if="openProfileDialog"
      :user="post.author"
      @close="openProfileDialog = false"
    ></profile-dialog>
  </div>
</template>

<script>
import postApi from '@/api/postApi'
import Comments from '@/components/posts/Comments'
import Detail from '@/components/posts/Detail'
import Related from '@/components/posts/Related'
import ProfileDialog from '@/components/profile/ProfileDialog'

export default {
  components: {
    Comments,
    'post-detail': Detail,
    'related-post': Related,
    ProfileDialog
  },

  data() {
    return {
      post: null,
      loading: false,
      deleteLoading: false,
      openProfileDialog: false,
      hideComments: false,
      total_comments: 0
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

  mounted() {
    const width = window.innerWidth

    if (width < 769) {
      this.hideComments = true
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
        this.total_comments = this.post.comments_count
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          return this.$router.replace({
            name: 'Page.Error',
            params: {
              code: 404
            }
          })
        }

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
