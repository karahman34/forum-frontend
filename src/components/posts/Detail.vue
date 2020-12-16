<template>
  <div class="post">
    <article class="media mb-0" style="overflow: visible !important">
      <!-- Figure -->
      <figure class="media-left">
        <img :src="post.author.avatar" class="avatar" />
      </figure>
      <!-- Media Content -->
      <div class="media-content" style="overflow: visible !important">
        <div class="content">
          <div
            class="is-flex is-justify-content-space-between is-align-items-flex-start"
          >
            <!-- Title -->
            <strong class="subtitle has-text-weight-medium mb-0">{{
              post.title
            }}</strong>

            <!-- Post Menus -->
            <div
              class="dropdown is-right post-menus-dropdown"
              :class="{ 'is-active': openMenu }"
            >
              <!-- Trigger -->
              <div
                class="dropdown-trigger pointer"
                style="font-size: 0"
                @click="openMenu = !openMenu"
              >
                <span
                  class="is-inline-block"
                  style="font-size: 2rem;line-height:6px !important"
                  >...</span
                >
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

          <!-- Meta -->
          <small class="has-text-grey is-block mt-1">
            <!-- Author -->
            <span class="mr-2 is-clickable" @click="$emit('open-profile')">
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
              <span> {{ totalComments }} comments</span>
            </span>
          </small>

          <!-- The Content -->
          <post-content class="is-hidden-touch" :post="post"></post-content>
        </div>
      </div>
    </article>

    <!-- On Mobile -->
    <div class="is-block-touch is-hidden-desktop">
      <!-- The Content -->
      <post-content :post="post"></post-content>
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
    },
    totalComments: {
      type: Number,
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
      return this.post.author.username === this.auth?.username
    }
  },

  mounted() {
    this.increaseViews()

    document.addEventListener('click', this.hidePostMenus)
  },

  methods: {
    hidePostMenus(e) {
      const postMenus = document.querySelector('.post-menus-dropdown')
      const childNodes = postMenus.querySelectorAll('*')
      const target = e.target

      if (
        this.openMenu === true &&
        !target.isSameNode(postMenus.querySelector('.dropdown-trigger span'))
      ) {
        for (let i = 0; i < childNodes.length; i++) {
          const childNode = childNodes[i]

          if (childNode.isSameNode(target)) {
            return
          }
        }

        this.openMenu = false
      }
    },
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
  },

  beforeDestroy() {
    document.removeEventListener('click', this.hidePostMenus)
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
