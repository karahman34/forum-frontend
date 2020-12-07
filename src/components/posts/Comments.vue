<template>
  <div>
    <!-- Header -->
    <div class="mb-1 columns is-mobile is-vcentered">
      <div class="column">
        <div class="has-text-weight-semibold subtitle mb-0">
          {{ post.comments_count }}
          Comments
        </div>
      </div>

      <div class="column">
        <div class="is-flex is-justify-content-flex-end">
          <!-- Create Comment -->
          <button
            class="button is-success mr-2"
            @click="openCreateCommentDialog"
          >
            <i class="fas fa-plus"></i>
            <span class="ml-2 has-text-weight-medium">
              <span class="is-hidden-touch mr-1">Add</span>
              <span>Comment</span>
            </span>
          </button>

          <!-- Sort -->
          <div class="field is-inline-block">
            <div class="control has-icons-left">
              <div class="select">
                <select v-model="sort">
                  <option value="" disabled>Sort</option>
                  <option
                    v-for="option in sortOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
              <div class="icon is-small is-left">
                <i class="fas fa-filter" style="color: #363636 !important"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <div class="has-text-centered subtitle mt-4">
        <i class="fas fa-spinner fa-spin"></i>
        <span class="ml-2">Getting comments...</span>
      </div>
    </template>

    <!-- Zero Comment -->
    <div
      v-else-if="!loading && comments !== null && !comments.length"
      class="has-text-centered subtitle mt-4"
    >
      This post has no comments yet.
    </div>

    <!-- Content -->
    <template v-else>
      <!-- List Comments -->
      <comment-card
        v-for="comment in comments"
        :key="comment.id"
        :post="post"
        :comment="comment"
        class="mb-3"
        @open-profile=";(openProfileDialog = true), (focusProfile = $event)"
        @edit="openEditCommentDialog"
        @deleted="commentDeletedHandler"
        @mark-solution="markSolutionHandler"
      ></comment-card>

      <!-- Pagination -->
      <pagination v-if="total > 10" :total="total"></pagination>
    </template>

    <!-- Create Dialog -->
    <create-comment
      v-if="openFormDialog && !focusComment"
      :post-id="post.id"
      @close="openFormDialog = false"
      @created="commentCreatedHandler"
    ></create-comment>

    <!-- Edit Dialog -->
    <edit-comment
      v-if="openFormDialog && focusComment !== null"
      :comment="focusComment"
      @close="openFormDialog = false"
      @updated="commentUpdatedHandler"
    ></edit-comment>

    <!-- Profile Dialog -->
    <profile-dialog
      v-if="openProfileDialog"
      :user="focusProfile"
      @close=";(openProfileDialog = false), (focusProfile = false)"
    ></profile-dialog>
  </div>
</template>

<script>
import postApi from '@/api/postApi'
import Card from '@/components/comments/Card'
import Form from '@/components/comments/FormDialog'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import ProfileDialog from '@/components/profile/ProfileDialog'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },

  components: {
    'comment-card': Card,
    'create-comment': Form,
    'edit-comment': Form,
    ProfileDialog,
    Pagination
  },

  data() {
    return {
      comments: null,
      loading: false,
      page: 1,
      sort: 'old',
      sortOptions: ['old', 'new'],
      total: null,
      openFormDialog: false,
      focusComment: null,
      openProfileDialog: false,
      focusProfile: null
    }
  },

  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn
    })
  },

  watch: {
    sort() {
      this.comments = null
      this.getComments()
    }
  },

  mounted() {
    this.getComments()
  },

  methods: {
    openCreateCommentDialog() {
      if (!this.loggedIn) {
        return this.$router.push({
          name: 'Login',
          query: {
            from: this.$route.path
          }
        })
      }

      this.openFormDialog = true
    },
    openEditCommentDialog(comment) {
      this.focusComment = comment
      this.openFormDialog = true
    },
    commentCreatedHandler() {
      this.page = 1
      this.sort = 'new'
      this.comments = null
      this.getComments()
    },
    commentUpdatedHandler() {
      this.comments = null
      this.getComments()
    },
    commentDeletedHandler() {
      this.getComments()
    },
    markSolutionHandler(comment) {
      const focusCommentIndex = this.comments.findIndex(
        _comment => _comment.id === comment.id
      )

      for (const comment of this.comments) {
        comment.solution = 'N'
      }

      this.$set(this.comments[focusCommentIndex], 'solution', 'Y')
    },
    async getComments() {
      this.loading = true

      try {
        const res = await postApi.getComments(this.post.id, {
          sort: this.sort,
          page: this.page
        })
        const { data, meta } = res.data

        this.comments = data
        this.total = meta.total
      } catch (err) {
        alert('Failed to get comments data, please try again later.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
