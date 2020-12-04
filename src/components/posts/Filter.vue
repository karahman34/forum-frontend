<template>
  <div>
    <!-- Filter -->
    <div class="columns is-vcentered is-gapless">
      <!-- Left -->
      <div class="column is-half">
        <!-- Tags -->
        <button
          class="button tags-button"
          :class="{ 'is-info': selectedTags.length }"
          @click="openSelectTags = true"
        >
          <i class="fas fa-tags"></i>
          <span class="ml-2">Tags</span>
        </button>

        <!-- Filter -->
        <div class="field filter is-inline-block">
          <div class="control has-icons-left is-inline-block">
            <div class="select">
              <select v-model="filter" class="is-inline-block">
                <option value="" disabled>Filter</option>
                <option
                  v-for="option in filterOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-filter" style="color: #363636 !important"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="column is-half">
        <div class="field search">
          <div class="control has-icons-left">
            <input
              v-model="search"
              type="text"
              class="input"
              placeholder="Search.."
            />
            <span class="icon is-small is-left">
              <i class="fas fa-search"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Select Tags -->
    <select-tags
      v-if="openSelectTags"
      :selected-tags="selectedTags"
      @save="selectedTags = $event"
      @close="openSelectTags = false"
    ></select-tags>
  </div>
</template>

<script>
import SelectTags from '@/components/posts/SelectTags'

export default {
  components: {
    SelectTags
  },

  data() {
    return {
      filterOptions: ['time', 'unsolved', 'solved'],
      openSelectTags: false,
      selectedTags: [],
      search: null,
      searchTimeout: null,
      filter: 'time'
    }
  },

  watch: {
    search() {
      if (this.searchTimeout !== null) clearTimeout(this.searchTimeout)

      this.searchTimeout = setTimeout(() => this.emitFilterEvent(), 500)
    },
    selectedTags() {
      this.emitFilterEvent()
    },
    filter() {
      this.emitFilterEvent()
    }
  },

  methods: {
    emitFilterEvent() {
      const payload = {
        tags: this.selectedTags.join(','),
        search: this.search,
        filter: this.filter
      }

      for (const key in payload) {
        const param = payload[key]

        if (param === null || param === '') {
          delete payload[key]
        }
      }

      this.$emit('filter', payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.field.search {
  display: flex;
  justify-content: baseline;
}

@media screen and (max-width: 956px) {
  .field.search {
    margin-top: 10px;

    .control {
      width: 100%;
    }
  }

  .tags-button,
  .field.filter {
    width: 50%;
  }

  .field.filter {
    .control {
      width: 100%;

      .select,
      .select select {
        width: 100%;
      }
    }
  }
}

@media screen and (min-width: 960px) {
  .field.search {
    justify-content: flex-end;
  }

  .tags-button {
    margin-right: 10px;
  }
}
</style>
