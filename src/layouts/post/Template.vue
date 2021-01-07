<template>
  <div class="post-template">
    <!-- Navbar -->
    <nav-bar
      id="post-navbar"
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
import { mapState } from 'vuex'
import notificationApi from '@/api/notificationApi'
import NavBar from '@/components/NavBar'
import Notifications from '@/components/Notifications'

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
    if (this.loggedIn) {
      this.windowClickEvent()
    }
  },

  methods: {
    windowClickEvent() {
      window.addEventListener('click', this.clickOutsideHandler)
    },
    removeWindowClickEvent() {
      window.removeEventListener('click', this.clickOutsideHandler)
    },
    clickOutsideHandler(e) {
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
    },
    resetNotificationsCount() {
      return notificationApi
        .open()
        .then(() => (this.new_notifications = 0))
        .catch(() => {})
    }
  },

  beforeDestroy() {
    this.removeWindowClickEvent()
  }
}
</script>

<style lang="scss" scoped>
#post-navbar {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

section.section {
  background-color: white !important;
  padding-top: 85px;
  width: 100%;
  min-height: 100vh;
  height: 100%;
}

.post-template {
  position: relative;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 1024px) {
  .container {
    padding-top: 10px;
  }
}
</style>
