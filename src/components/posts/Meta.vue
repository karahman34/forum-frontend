<template>
  <div>
    <!-- Header Text -->
    <div class="subtitle mb-2">
      <i class="fas fa-info-circle"></i>
      <span class="ml-2">Meta</span>
    </div>

    <!-- Author -->
    <div>
      <span>Author: </span>
      <span class="has-text-grey is-clickable" @click="$emit('open-profile')">{{
        post.author.username
      }}</span>
    </div>

    <!-- Views -->
    <div>
      <span>Views: </span>
      <span class="has-text-grey">{{ post.views }}</span>
    </div>

    <!-- Comments Count -->
    <div>
      <span>Comments: </span>
      <span class="has-text-grey">{{ post.comments_count }}</span>
    </div>

    <!-- Status -->
    <div>
      <span>Status: </span>
      <span class="has-text-grey">{{
        post.solved.toLowerCase() === 'y' ? 'Solved' : 'Unsolved'
      }}</span>
    </div>

    <!-- Tags -->
    <div>
      <span>Tags: </span>
      <span class="has-text-grey">{{ post.tags.join(', ') }}</span>
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
