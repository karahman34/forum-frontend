import Echo from 'laravel-echo'
import { tokenName } from './httpPlugin'

window.Pusher = require('pusher-js')

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: `${process.env.VUE_APP_BASE_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  }
})
