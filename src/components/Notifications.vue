<template>
  <div class="notifications card">
    <div class="card-content mx-0 px-0 py-0">
      <!-- Header -->
      <div
        class="header px-4 py-2 is-flex is-align-items-center is-justify-content-space-between"
      >
        <div>
          <i class="fas fa-bell"></i>
          <span class="ml-2 has-text-weight-medium">Notifications</span>
        </div>

        <div class="is-clickable" @click="$emit('hide')">
          <i class="far fa-times-circle"></i>
        </div>
      </div>

      <!-- No Notif -->
      <div
        v-if="!loading && !notifications.length"
        class="py-3 has-text-centered has-text-grey"
      >
        You doesn't have any notifications yet.
      </div>

      <!-- Notification List -->
      <article
        v-for="notification in notifications"
        :key="notification.id"
        class="media notification my-0 px-4 has-background-white"
        :class="{
          unread: notification.read_at === null
        }"
      >
        <figure class="media-left" @click="goToPost(notification)">
          <!-- Avatar -->
          <p class="image is-64x64">
            <img class="is-rounded" :src="notification.from.avatar" />
          </p>
        </figure>
        <div class="media-content" @click="goToPost(notification)">
          <!-- Content -->
          <div class="content">
            <div>
              <!-- Message -->
              <p class="mb-0">
                {{ notification.message }}
              </p>

              <!-- Time -->
              <small class="has-text-grey">
                <i class="fas fa-clock"></i>
                {{ formatTime(notification.new_created_at) }}
              </small>
            </div>
          </div>
        </div>
        <div class="media-right">
          <!-- Delete Button -->
          <button
            type="button"
            class="delete"
            :class="{ 'is-hidden': inDeletion.includes(notification.id) }"
            @click="deleteNotification(notification.id)"
          ></button>

          <!-- Loading -->
          <template>
            <div
              :class="{
                'is-hidden': !inDeletion.includes(notification.id)
              }"
            >
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </template>
        </div>
      </article>

      <!-- Get More -->
      <div
        v-if="next"
        class="py-1 has-text-centered load-more"
        @click="getNotifications"
      >
        <span v-if="!loading">Load more</span>
        <template v-else>
          <div>
            <i class="fas fa-spinner fa-spin"></i>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import notificationApi from '@/api/notificationApi'

export default {
  props: {
    authId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      notifications: [],
      loading: false,
      page: 1,
      next: null,
      inDeletion: []
    }
  },

  mounted() {
    this.getNotifications()

    // Listen pusher events.
    window.Echo.private(`notifications.${this.authId}`).listen(
      '.refresh',
      () => {
        this.page = 1
        this.notifications = []
        this.$nextTick(() => this.getNotifications())
      }
    )
  },

  methods: {
    formatTime(time) {
      return moment(time).fromNow()
    },
    goToPost(notification) {
      return this.$router
        .push({
          name: 'Post',
          params: {
            id: notification.post.id,
            slug: notification.post.title.replace(/ /g, '-')
          }
        })
        .then(() => {
          this.$emit('hide')

          if (!notification.read_at) {
            this.markReaded(notification.id)
          }
        })
    },
    markReaded(id) {
      notificationApi
        .markRead(id)
        .then(() => {
          const notification = this.notifications.find(
            _notif => _notif.id === id
          )
          notification.read_at = new Date()
        })
        .catch(() => {})
    },
    async getNotifications() {
      this.loading = true

      try {
        const res = await notificationApi.collection({
          page: this.page
        })
        const { data, links } = res.data

        this.page += 1
        this.notifications.push(...data)
        this.next = links.next

        this.$emit('new-notifications', res.data.new_notifications)
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to get notifications.')
      } finally {
        this.loading = false
      }
    },
    async deleteNotification(id) {
      this.inDeletion.push(id)

      try {
        await notificationApi.delete(id)

        this.notifications.splice(
          this.notifications.findIndex(_notif => _notif.id === id),
          1
        )
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to get notifications.')
      } finally {
        this.inDeletion.splice(this.inDeletion.indexOf(id), 1)
      }
    }
  },

  beforeDestroy() {
    window.Echo.leave(`notifications.${this.authId}`)
  }
}
</script>

<style lang="scss" scoped>
.notifications {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 28%;
  height: max-content;
  max-height: 60vh;
  overflow-y: auto;
  border-radius: 0;
  margin-top: 53px;
  z-index: 999;

  .header {
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  }

  .notification {
    cursor: pointer;

    &:hover {
      background-color: #f3f3f3 !important;
    }
  }

  .notification.unread {
    background-color: #f3f3f3 !important;
  }

  .load-more {
    cursor: pointer;
    color: rgb(128, 128, 128);
  }
}

@media screen and (max-width: 1657px) {
  .notifications {
    width: 45%;
  }
}

@media screen and (max-width: 960px) {
  .notifications {
    width: 100%;
  }
}
</style>
