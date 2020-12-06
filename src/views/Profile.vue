<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-half">
        <!-- Profile Card -->
        <profile-card :auth="auth" @update="refreshUser"></profile-card>
      </div>

      <div class="column is-half">
        <!-- Email Card -->
        <email-card :auth="auth"></email-card>

        <!-- Password Card -->
        <password-card
          class="mt-5"
          :auth="auth"
          @update="refreshUser"
        ></password-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import EmailCard from '@/components/profile/EmailCard'
import ProfileCard from '@/components/profile/ProfileCard'
import PasswordCard from '@/components/profile/PasswordCard'

export default {
  components: {
    EmailCard,
    ProfileCard,
    PasswordCard
  },

  computed: {
    ...mapState('auth', {
      auth: state => state.user
    })
  },

  methods: {
    ...mapActions('auth', {
      refreshUser: 'getUser'
    })
  }
}
</script>
