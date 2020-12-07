<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <!-- Brand -->
      <div class="navbar-brand">
        <router-link class="navbar-item" :to="{ name: 'Home' }">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          />
        </router-link>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarDefaultLayout"
          @click="showNavbarMenu = !showNavbarMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
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
            <div class="navbar-item">
              <a href="#" class="text">Notifications</a>
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

        this.$router.replace({
          name: 'Login'
        })
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
  width: 33px;
  height: 33px;
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
</style>
