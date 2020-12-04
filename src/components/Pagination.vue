<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <!-- Prev Page -->
    <button
      class="pagination-previous has-background-link has-text-white"
      :disabled="activePage === 1"
      @click="goTo(activePage - 1)"
    >
      <i class="fas fa-chevron-left"></i>
      <i class="fas fa-chevron-left mr-2"></i>
      Previous
    </button>
    <!-- Next Page -->
    <button
      class="pagination-next has-background-link has-text-white"
      :disabled="activePage === lastPage"
      @click="goTo(activePage + 1)"
    >
      Next
      <i class="fas fa-chevron-right ml-2"></i>
      <i class="fas fa-chevron-right"></i>
    </button>

    <ul class="pagination-list">
      <!-- Prev Pages -->
      <li v-for="page in prevPages" :key="page">
        <a class="pagination-link button is-white" @click="goTo(page)">{{
          page
        }}</a>
      </li>

      <!-- Current Page -->
      <li>
        <a class="pagination-link is-current">{{ activePage }}</a>
      </li>

      <!-- Next Pages -->
      <li v-for="page in nextPages" :key="page">
        <a class="pagination-link button is-white" @click="goTo(page)">{{
          page
        }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      activePage: 1,
      views: 4
    }
  },

  computed: {
    lastPage() {
      return Math.ceil(this.total / this.perPage)
    },
    prevPages() {
      const pages = []
      for (let n = this.views; n >= 1; n--) {
        const page = this.activePage - n

        if (page > 0 && page < this.activePage) {
          pages.push(page)
        }
      }

      return pages
    },
    nextPages() {
      const pages = []

      for (let n = 1; n <= this.views; n++) {
        const page = this.activePage + n

        if (page <= this.lastPage) {
          pages.push(page)
        }
      }

      return pages
    }
  },

  methods: {
    goTo(page) {
      this.activePage = page
      this.$emit('input', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-link {
  box-shadow: 0px 0px 8px rgba(128, 128, 128, 0.4);
}
</style>
