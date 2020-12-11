<template>
  <div class="default-template">
    <!-- Navbar -->
    <nav-bar
      :new-notifications="new_notifications"
      @click-notifications="notificationDialog = !notificationDialog"
    ></nav-bar>

    <!-- Notifications -->
    <notifications
      v-if="loggedIn"
      id="notifications-component"
      :auth-id="auth.id"
      :class="{ 'is-hidden': !notificationDialog }"
      @hide="notificationDialog = false"
      @new-notifications="new_notifications = $event"
    ></notifications>

    <section class="section">
      <div class="container">
        <!-- Router View -->
        <slot></slot>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from './_NavBar'
import Notifications from '@/components/Notifications'
import { mapState } from 'vuex'
import notificationApi from '@/api/notificationApi'

export default {
  components: {
    NavBar,
    Notifications
  },

  data() {
    return {
      notificationDialog: false,
      new_notifications: 0
    }
  },

  computed: {
    ...mapState('auth', {
      auth: state => state.user,
      loggedIn: state => state.loggedIn
    })
  },

  watch: {
    notificationDialog(newVal, oldVal) {
      if (newVal && !oldVal && parseInt(this.new_notifications) > 0) {
        this.resetNotificationsCount()
      }
    }
  },

  mounted() {
    this.clickOutsideEvent()
  },

  methods: {
    clickOutsideEvent() {
      // Click Event
      window.addEventListener('click', e => {
        const triggerDesktop = document.querySelector(
          '.notification-trigger-desktop'
        )
        const triggerMobile = document.querySelector(
          '.notification-trigger-mobile'
        )
        const notificationsComponent = document.querySelector(
          '#notifications-component'
        )

        // Merge child nodes.
        const childNodes = [
          ...triggerMobile.querySelectorAll('*'),
          ...triggerDesktop.querySelectorAll('*'),
          ...notificationsComponent.querySelectorAll('*')
        ]

        // Target
        const target = e.target

        if (
          this.notificationDialog &&
          triggerMobile.isSameNode(target) === false &&
          triggerDesktop.isSameNode(target) === false &&
          notificationsComponent.isSameNode(target) === false
        ) {
          // Check from child nodes
          for (let i = 0; i < childNodes.length; i++) {
            const childNode = childNodes[i]

            if (childNode.isSameNode(target)) {
              return
            }
          }

          this.notificationDialog = false
        }
      })
    },
    resetNotificationsCount() {
      return notificationApi
        .open()
        .then(() => (this.new_notifications = 0))
        .catch(() => {})
    }
  },

  beforeDestroy() {
    window.removeEventListener('click', () => {})
  }
}
</script>

<style lang="scss" scoped>
section.section {
  background-color: #f3f3f3;
  padding-top: 85px;
}

.default-template {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
