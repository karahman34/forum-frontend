<template>
  <div class="card comment">
    <div class="card-content">
      <article class="media">
        <figure class="media-left">
          <!-- Avatar -->
          <img class="avatar" :src="comment.author.avatar" />
        </figure>
        <div class="media-content">
          <div class="content">
            <!-- Header -->
            <div
              class="is-flex is-justify-content-space-between is-flex-wrap-wrap"
            >
              <!-- Left -->
              <div>
                <!-- Username -->
                <strong class="mr-1">{{ comment.author.username }}</strong>
                <!-- Posted Time -->
                <small class="has-text-grey-dark">{{ postedTime }}</small>
              </div>

              <!-- Right -->
              <div>
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

                <!-- Edit Button -->
                <button
                  class="button is-light ml-2"
                  v-if="isOwnerOfTheComment"
                  @click="$emit('edit', comment)"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>
            <!-- Comment Body -->
            <p class="mb-0 mt-1" v-html="cleanedBody"></p>
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
      markSolutionLoading: false
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
}
</style>
