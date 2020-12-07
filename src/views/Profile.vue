<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-half">
        <!-- Profile Card -->
        <profile-card :auth="auth" @update="refreshUser"></profile-card>
      </div>

      <div class="column is-half">
        <!-- Password Card -->
        <password-card :auth="auth" @update="refreshUser"></password-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ProfileCard from '@/components/profile/ProfileCard'
import PasswordCard from '@/components/profile/PasswordCard'

export default {
  components: {
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
