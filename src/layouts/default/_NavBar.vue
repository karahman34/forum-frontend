<template>
  <nav
    class="navbar is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <!-- Brand -->
      <div class="navbar-brand">
        <!-- Logo -->
        <router-link class="navbar-item" :to="{ name: 'Home' }">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          />
        </router-link>

        <div class="navbar-mobile-right">
          <!-- Bell Icon -->
          <div
            class="notification-trigger-mobile is-hidden-desktop"
            @click="$emit('click-notifications')"
          >
            <i class="far fa-bell"></i>
          </div>

          <!-- Burger -->
          <div
            role="button"
            class="navbar-burger burger mx-0"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarDefaultLayout"
            @click="showNavbarMenu = !showNavbarMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>
      </div>

      <div
        id="navbarDefaultLayout"
        class="navbar-menu"
        :class="{ 'is-active': showNavbarMenu }"
      >
        <!-- Navbar End -->
        <div class="navbar-end">
          <!-- Guest -->
          <template v-if="!loggedIn">
            <div class="navbar-item">
              <div class="buttons">
                <router-link
                  :to="{ name: 'Register' }"
                  class="button is-primary"
                >
                  <strong>Sign up</strong>
                </router-link>
                <router-link :to="{ name: 'Login' }" class="button is-light">
                  Log in
                </router-link>
              </div>
            </div>
          </template>

          <!-- Auth -->
          <template v-else>
            <!-- Home -->
            <div class="navbar-item">
              <router-link :to="{ name: 'Home' }" class="text"
                >Home</router-link
              >
            </div>

            <!-- Notifications -->
            <div
              class="navbar-item notification-trigger-desktop is-clickable is-hidden-touch"
              @click="$emit('click-notifications')"
            >
              <span class="text">Notifications</span>
              <small v-if="newNotifications > 0" class="notifications-count">{{
                newNotifications
              }}</small>
            </div>

            <!-- User Dropdown -->
            <div class="navbar-item">
              <div
                class="dropdown is-hoverable"
                :class="{ 'is-active': openUserDropdown }"
              >
                <!-- Trigger -->
                <div
                  class="dropdown-trigger is-flex is-align-items-center"
                  @click="openUserDropdown = !openUserDropdown"
                >
                  <img :src="user.avatar" class="avatar" />
                  <span class="mx-2">{{ user.username }}</span>
                  <i class="fas fa-chevron-down"></i>
                </div>

                <!-- Menus -->
                <div class="dropdown-menu">
                  <div class="dropdown-content py-0">
                    <!-- Profile -->
                    <router-link
                      class="dropdown-item"
                      :to="{ name: 'Profile' }"
                    >
                      <i class="fas fa-user icon"></i>
                      <a href="#" class="text">Profile</a>
                    </router-link>
                    <!-- Logout -->
                    <div
                      id="logout-container"
                      class="dropdown-item"
                      v-if="!logoutLoading"
                      @click="goLogout"
                    >
                      <i class="fas fa-sign-out-alt icon"></i>
                      <a class="text" href="#">Logout</a>
                    </div>
                    <div class="dropdown-item" v-if="logoutLoading">
                      <i class="fas fa-spinner fa-spin icon"></i>
                      <a href="#" class="text">Logout</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    newNotifications: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      showNavbarMenu: false,
      openUserDropdown: false,
      logoutLoading: false
    }
  },

  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
      user: state => state.user
    })
  },

  methods: {
    ...mapActions('auth', {
      logoutAction: 'logout'
    }),
    async goLogout() {
      this.logoutLoading = true

      try {
        // Dispatch action
        await this.logoutAction()

        const routerData = this.$router.resolve({
          name: 'Login'
        })

        window.location.href = routerData.href
      } catch (err) {
        alert('Failed to logout user, please try again later.')
      } finally {
        this.logoutLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#logout-container {
  transition: all 0.4s;

  &:hover {
    background-color: red;

    .text,
    .icon {
      color: white;
    }
  }
}

.avatar {
  object-fit: cover;
  border-radius: 50%;
  width: 30px;
  height: 35px;
}

.dropdown {
  .dropdown-content {
    overflow: hidden;

    .dropdown-item {
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        background-color: rgb(238, 235, 235);
      }

      .text {
        color: hsl(0, 0%, 21%);
      }

      .icon {
        display: inline-block;
        margin-right: 6px;
      }
    }
  }
}

.navbar {
  .navbar-item {
    .text {
      color: rgb(74, 74, 74);
    }

    .text.router-link-exact-active {
      @media screen and (max-width: 956px) {
        color: rgb(0, 209, 178);
      }

      @media screen and (min-width: 960px) {
        &::after {
          content: '';
          display: block;
          height: 4px;
          width: 50%;
          background-color: rgb(0, 209, 178);
        }
      }
    }
  }
}

.notification-trigger-desktop {
  position: relative;

  .notifications-count {
    position: absolute;
    top: 8px;
    right: -2px;
    color: white;
    background-color: hsl(171, 100%, 41%);
    border-radius: 50%;
    padding: 0px 6px;
    font-weight: 500;
    text-align: center;
  }
}

.navbar-mobile-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;

  .notification-trigger-mobile {
    cursor: pointer;
    width: 3rem;
    height: 3.25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f3f3f3 !important;
    }
  }
}
</style>
