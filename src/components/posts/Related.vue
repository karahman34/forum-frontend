<template>
  <div>
    <!-- Header Text -->
    <div class="subtitle mb-3">
      <i class="fas fa-rocket"></i>
      <span class="ml-2">Related Posts</span>
    </div>

    <!-- First Loading -->
    <template v-if="loading && !relatedPosts.length">
      <div class="has-text-centered">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
      </div>
    </template>

    <!-- Content -->
    <div class="content mb-2" v-if="relatedPosts.length">
      <ul class="ml-5">
        <li v-for="relatedPost in relatedPosts" :key="relatedPost.id">
          <router-link
            :to="{
              name: 'Post',
              params: {
                id: relatedPost.id,
                slug: relatedPost.title.replace(/ /g, '-')
              }
            }"
          >
            <!-- Title -->
            {{ relatedPost.title }}
          </router-link>
        </li>
      </ul>
    </div>

    <button
      v-if="relatedPosts.length && next"
      class="button is-info is-fullwidth is-light has-text-centered"
      :class="{ 'is-loading': loading }"
      :disabled="loading"
      @click="getRelatedPosts"
    >
      See More
    </button>
  </div>
</template>

<script>
import postApi from '@/api/postApi'
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      relatedPosts: [],
      page: 1,
      next: null
    }
  },

  mounted() {
    this.getRelatedPosts()
  },

  methods: {
    async getRelatedPosts() {
      this.loading = true

      try {
        const res = await postApi.collection({
          tags: this.post.tags.join(','),
          limit: 20
        })
        const { data, links } = res.data

        this.relatedPosts.push(...data)
        this.next = links.next
        this.page += 1
      } catch (err) {
        alert('Failed to get related posts data.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
