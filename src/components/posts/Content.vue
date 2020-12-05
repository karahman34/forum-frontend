<template>
  <div>
    <div class="divider my-1"></div>

    <!-- Body -->
    <p class="body mb-2">
      {{ post.body }}
    </p>

    <!-- Screenshots -->
    <div v-if="post.screenshots.length">
      <i class="fas fa-images"></i>
      <span class="subtitle mb-0 ml-2">Screenshots</span>

      <a
        v-for="screenshot in post.screenshots"
        :key="screenshot.original"
        :href="screenshot.url"
        class="mt-2 is-block"
        target="_blank"
      >
        <img :src="screenshot.url" />
      </a>
    </div>

    <!-- Tags -->
    <div class="mt-2">
      <span
        class="tag is-info is-light mr-1 mb-1"
        v-for="tag in post.tags"
        :key="tag"
        >{{ tag }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  width: 100%;
  height: 1px;
  background-color: rgba(128, 128, 128, 0.5);
}
</style>
