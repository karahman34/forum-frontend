import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
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
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: 'Register',
      layout: 'auth',
      guest: true
    },
    component: () => import('@/views/Register')
  },
  {
    path: '/reset-password',
    name: 'Reset_Password',
    meta: {
      title: 'Reset Password',
      layout: 'auth',
      guest: true
    },
    component: () => import('@/views/ResetPassword')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      title: 'Profile',
      auth: true
    },
    component: () => import('@/views/Profile')
  },
  {
    path: '/post',
    name: 'Post.Create',
    meta: {
      auth: true
    },
    component: () => import('@/views/Post-Form.vue')
  },
  {
    path: '/post/:id',
    name: 'Post.Edit',
    meta: {
      auth: true
    },
    component: () => import('@/views/Post-Form.vue')
  },
  {
    path: '/post/:id/:slug',
    name: 'Post',
    component: () => import('@/views/Post')
  },
  {
    path: '/errors/:code',
    name: 'Page.Error',
    component: () => import('@/views/PageError')
  },
  {
    path: '*',
    component: () => import('@/views/NotFound')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
