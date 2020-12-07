<template>
  <div class="card comment" style="overflow: visible !important">
    <div class="card-content">
      <article class="media">
        <figure class="media-left">
          <!-- Avatar -->
          <img class="avatar" :src="comment.author.avatar" />
        </figure>
        <div class="media-content">
          <div class="content">
            <!-- Header -->
            <!-- Username -->
            <strong
              class="mr-1 is-clickable"
              @click="$emit('open-profile', comment.author)"
              >{{ comment.author.username }}</strong
            >
            <!-- Posted Time -->
            <small class="has-text-grey-dark">{{ postedTime }}</small>
            <!-- Comment Body -->
            <p class="mb-0 mt-1" v-html="cleanedBody"></p>
          </div>
        </div>
        <div class="media-right">
          <!-- Mark as solution -->
          <button
            v-if="comment.solution === 'N' && isOwnerOfThePost"
            class="button is-success is-light is-rounded"
            @click="markSolution"
          >
            <template v-if="!markSolutionLoading">
              <div>
                <i class="fas fa-check"></i>
              </div>
            </template>

            <template v-else>
              <div>
                <i class="fas fa-spinner fa-spin"></i>
              </div>
            </template>
            <span class="ml-2">Mark as solution</span>
          </button>

          <!-- Solution -->
          <button
            v-else-if="comment.solution === 'Y'"
            class="button is-success is-rounded"
          >
            <i class="fas fa-check"></i>
            <span class="ml-2">Solution</span>
          </button>

          <!-- Menus -->
          <div class="dropdown is-right" :class="{ 'is-active': openMenu }">
            <div class="dropdown-trigger ml-3">
              <span
                class="pointer"
                style="font-size: 2rem;line-height: 0;"
                @click="openMenu = !openMenu"
                >...</span
              >
            </div>

            <div class="dropdown-menu">
              <div class="dropdown-content py-0">
                <!-- Edit -->
                <div
                  class="dropdown-item pointer"
                  @click="$emit('edit', comment), (openMenu = false)"
                >
                  <i class="fas fa-pencil-alt"></i>
                  <span class="ml-2">Edit</span>
                </div>

                <!-- Delete -->
                <div
                  class="dropdown-item"
                  :class="{ pointer: !deleteLoading }"
                  @click="deleteComment"
                >
                  <template v-if="!deleteLoading">
                    <span>
                      <i class="fas fa-trash"></i>
                    </span>
                  </template>

                  <template v-else>
                    <span>
                      <i class="fas fa-spinner fa-spin"></i>
                    </span>
                  </template>

                  <span class="ml-2">Delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import commentApi from '@/api/commentApi'

export default {
  props: {
    comment: {
      type: Object,
      required: true
    },
    post: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      markSolutionLoading: false,
      openMenu: false,
      deleteLoading: false
    }
  },

  computed: {
    ...mapState('auth', {
      auth: state => state.user
    }),
    postedTime() {
      return moment(this.comment.created_at).fromNow()
    },
    isOwnerOfTheComment() {
      return this.comment.author.username === this.auth.username
    },
    isOwnerOfThePost() {
      return this.post.author.username === this.auth.username
    },
    cleanedBody() {
      // return this.comment.body
      return this.$sanitize(this.comment.body)
    }
  },

  methods: {
    async markSolution() {
      this.markSolutionLoading = true

      try {
        await commentApi.markSolution(this.comment.id)

        this.$emit('mark-solution', this.comment)
      } catch (err) {
        alert('Failed to update comment data, please try again later.')
      } finally {
        this.markSolutionLoading = false
      }
    },
    async deleteComment() {
      this.openMenu = false
      if (this.deleteLoading) return
      const ask = confirm('Are you sure want to delete this comment ?')
      if (!ask) return

      try {
        await commentApi.delete(this.comment.id)

        this.$emit('deleted', this.comment)
      } catch (err) {
        alert('Failed to delete comment, please try again later.')
      } finally {
        this.deleteLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  .avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  @media screen and (min-width: 960px) {
    .avatar {
      width: 60px;
      height: 60px;
    }
  }

  @media screen and (max-width: 956px) {
    .button {
      font-size: 0.75rem;
    }
  }

  .dropdown-item:hover {
    background-color: #f3f3f3;
  }
}
</style>
