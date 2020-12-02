import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      auth: true
    },
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login',
      layout: 'auth',
      guest: true
    },
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
