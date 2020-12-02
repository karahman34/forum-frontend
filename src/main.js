import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import Plugins
import httpPlugin from './plugins/httpPlugin'

// Use Fontawesome
import '@fortawesome/fontawesome-free/js/all.js'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

// Use Http Plugins
Vue.use(httpPlugin)

const runApp = () => {
  document.querySelector('#app').innerHTML = ''

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
  const userAuthToken = localStorage.getItem()

  // Run the app
  runApp()
}

initializeApp()
