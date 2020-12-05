<template>
  <div class="card">
    <div class="card-content">
      <!-- Header Text -->
      <div class="subtitle mb-3">
        <i class="fas fa-rocket"></i>
        <span class="ml-2">Related Posts</span>
      </div>

      <!-- Content -->
      <div class="content">
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
              {{ relatedPost.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
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
      relatedPosts: null,
      loading: false
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
        const { data } = res.data

        this.relatedPosts = data
      } catch (err) {
        alert('Failed to get related posts data.')
      } finally {
        this.loading = true
      }
    }
  }
}
</script>
