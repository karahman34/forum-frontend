<template>
  <div class="my-0 notification" :class="[`is-${type}`, { 'is-light': light }]">
    <!-- Icon -->
    <template v-if="type === 'success'">
      <span>
        <i class="fas fa-check-circle"></i>
      </span>
    </template>
    <template v-if="type === 'danger'">
      <span>
        <i class="fas fa-times-circle"></i>
      </span>
    </template>
    <template v-if="type === 'warning'">
      <span>
        <i class="fas fa-exclamation-circle"></i>
      </span>
    </template>

    <!-- Message -->
    <span class="ml-2">{{ message }}</span>

    <!-- Slot -->
    <slot></slot>
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
    },
    light: {
      type: Boolean,
      default: true
    }
  }
}
</script>
