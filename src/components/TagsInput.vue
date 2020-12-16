<template>
  <vue-tags-input
    v-model="tag"
    class="tag-input custom"
    placeholder="Tags"
    :tags="tags"
    :validation="validation"
    :autocomplete-items="filteredTags"
    @tags-changed="tagsChanged"
  />
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'
import postApi from '@/api/postApi'

export default {
  components: {
    VueTagsInput
  },

  props: {
    tags: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      tag: '',
      available_tags: [],
      validation: [
        {
          classes: 'invalid',
          disableAdd: true,
          rule: /^[a-z0-9]+$/
        }
      ]
    }
  },

  computed: {
    filteredTags() {
      return this.available_tags.filter(tag => {
        return tag.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1
      })
    }
  },

  mounted() {
    this.getTags()
  },

  methods: {
    getTags() {
      postApi
        .getAvailableTags()
        .then(res => {
          const { data } = res.data

          this.available_tags = data.map(tag => ({ text: tag }))
        })
        .catch(() => {})
    },
    tagsChanged(tags) {
      this.$emit('input', tags)
    }
  }
}
</script>

<style lang="scss">
.tag-input.custom {
  max-width: none !important;
  width: 100% !important;

  .ti-tag {
    color: #1d72aa !important;
    background-color: #eef6fc !important;
  }

  .ti-tag.ti-deletion-mark {
    color: #cc0f35 !important;
    background-color: #feecf0 !important;
  }
}
</style>
