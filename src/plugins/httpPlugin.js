const { default: Axios } = require('axios')

// Properties
const tokenName = 'auth.token'
const expiredTokenName = 'auth.expired_at'
const http = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL
})

/**
 * Apply token to http object
 *
 * @return  {void}
 */
const applyToken = token => {
  http.defaults.headers.common['Authorization'] = token
}

/**
 * Set new token and expired time into local storage.
 *
 * @param   {String}  token
 * @param   {Number}  expiredAt
 *
 * @return  {void}
 */
const setToken = (token, expiredAt) => {
  // Store token into local storage
  localStorage.setItem(tokenName, token)

  // Store expired time to local storage
  const expiredDate = new Date()
  expiredDate.setSeconds(expiredAt)
  localStorage.setItem(expiredTokenName, expiredDate)

  // Apply token
  applyToken(token)
}

/**
 * Remove auth token and expired token time from local storage.
 *
 * @return  {void}
 */
const removeToken = () => {
  localStorage.removeItem(tokenName)
  localStorage.removeItem(expiredTokenName)
}

export { http, tokenName, expiredTokenName, applyToken, setToken, removeToken }

export default {
  install: Vue => {
    Vue.prototype.$http = http
  }
}
