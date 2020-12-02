import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { routerGuard } from './helpers/route'

// Import Plugins
import httpPlugin, {
  tokenName,
  expiredTokenName,
  applyToken,
  removeToken
} from './plugins/httpPlugin'

// Use Fontawesome
import '@fortawesome/fontawesome-free/js/all.js'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

// Use Http Plugins
Vue.use(httpPlugin)

const runApp = () => {
  document.querySelector('#app').innerHTML = ''

  // Add title & checking middleware
  router.beforeEach(routerGuard)

  // Make vue
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

const initializeApp = () => {
  // Show the loading
  document.querySelector('#app').innerHTML = 'Loading...'

  // Check the user token
  const userAuthToken = localStorage.getItem(tokenName)
  const userAuthTokenExpiredDate = localStorage.getItem(expiredTokenName)

  if (userAuthToken && userAuthTokenExpiredDate) {
    const dateNow = new Date()
    const userTokenDate = new Date(userAuthTokenExpiredDate)

    if (dateNow <= userTokenDate) {
      // Set HTTP token
      applyToken(userAuthToken)

      // Get user details
      store
        .dispatch('auth/getUser')
        .then(() => store.commit('auth/SET_LOGGED_IN', true))
        .catch(() => removeToken())
        .finally(() => runApp())
    } else {
      removeToken()
      runApp()
    }
  } else {
    runApp()
  }
}

initializeApp()
