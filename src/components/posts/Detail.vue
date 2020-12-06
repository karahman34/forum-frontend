<template>
  <div class="card post">
    <div class="card-content">
      <article class="media mb-0">
        <figure class="media-left">
          <img :src="post.author.avatar" class="avatar" />
        </figure>
        <div class="media-content">
          <div class="content">
            <div>
              <!-- Title -->
              <strong class="subtitle has-text-weight-medium">{{
                post.title
              }}</strong>

              <!-- Meta -->
              <small class="has-text-grey is-block mt-1">
                <!-- Author -->
                <span class="mr-2">
                  <i class="fas fa-user"></i>
                  {{ post.author.username }}
                </span>

                <!-- Posted Time -->
                <span>
                  <i class="fas fa-calendar-alt"></i>
                  {{ postedTime }}
                </span>

                <!-- Views -->
                <span class="mx-2">
                  <i class="fas fa-eye"></i>
                  <span> {{ post.views }} views</span>
                </span>

                <!-- Comments -->
                <span>
                  <i class="fas fa-comments"></i>
                  <span> {{ post.comments_count }} comments</span>
                </span>
              </small>

              <!-- The Content -->
              <post-content class="is-hidden-touch" :post="post"></post-content>
            </div>
          </div>
        </div>
        <div class="media-right" v-if="isAuthor">
          <div class="dropdown is-right" :class="{ 'is-active': openMenu }">
            <div class="dropdown-trigger pointer" @click="openMenu = !openMenu">
              <span style="font-size: 2rem;line-height: 0;">...</span>
            </div>

            <div class="dropdown-menu">
              <div class="dropdown-content py-0">
                <div
                  v-if="post.solved === 'N'"
                  class="dropdown-item"
                  @click="markSolved"
                >
                  <template v-if="!solveLoading">
                    <span>
                      <i class="fas fa-check"></i>
                    </span>
                  </template>
                  <template v-else>
                    <span>
                      <i class="fas fa-spinner fa-spin"></i>
                    </span>
                  </template>
                  <span class="ml-2">Solve</span>
                </div>

                <router-link
                  class="dropdown-item"
                  :to="{
                    name: 'Post.Edit',
                    params: {
                      id: post.id
                    }
                  }"
                >
                  <i class="fas fa-pencil-alt"></i>
                  <span class="ml-2">Edit</span>
                </router-link>

                <div class="dropdown-item" @click="$emit('delete')">
                  <i class="fas fa-trash"></i>
                  <span class="ml-2">Delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- On Mobile -->
      <div class="is-block-touch is-hidden-desktop">
        <!-- The Content -->
        <post-content :post="post"></post-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import postApi from '@/api/postApi'
import Content from '@/components/posts/Content'

export default {
  components: {
    'post-content': Content
  },

  props: {
    post: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      openMenu: false,
      solveLoading: false
    }
  },

  computed: {
    ...mapState('auth', {
      auth: state => state.user
    }),
    postedTime() {
      return moment(this.post.created_at).calendar()
    },
    isAuthor() {
      return this.post.author.username === this.auth.username
    }
  },

  mounted() {
    this.increaseViews()
  },

  methods: {
    increaseViews() {
      postApi.increaseViews(this.post.id).catch(() => {})
    },
    async markSolved() {
      const ask = confirm('are you sure that this post is solved ?')
      if (!ask) return
      this.solveLoading = true

      try {
        await postApi.markSolved(this.post.id)

        this.$emit('solved', this.post)
      } catch (eerr) {
        alert('Failed to update post data, please try again later.')
      } finally {
        this.solveLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
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

  .dropdown-item {
    cursor: pointer;

    &:hover {
      background-color: #f1f1f1 !important;
    }
  }
}
</style>
