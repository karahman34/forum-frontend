<template>
  <div class="my-0 notification is-light" :class="[`is-${type}`]">
    <i :class="finalIcon" class="mr-1"></i>
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    },
    icon: {
      type: String,
      default: null
    }
  },

  computed: {
    finalIcon() {
      let icon = null

      if (this.icon === null) {
        if (this.type == 'success') {
          icon = 'check-circle'
        } else if (this.type == 'danger') {
          icon = 'times-circle'
        } else if (this.type == 'warning') {
          icon = 'exclamation-circle'
        }
      } else {
        icon = this.icon
      }

      return `fas fa-${icon}`
    }
  }
}
</script>
