import store from '@/store'

const setTitle = to => {
  const title = to?.meta?.title
  const appName = process.env.VUE_APP_NAME

  document.title = !title ? appName : `${title} - ${appName}`
}

const routerGuard = (to, from, next) => {
  // Get user state
  const authState = store.state.auth

  // Get the middleware list
  const { auth, guest } = to.meta

  if (auth && !authState.loggedIn) return next('/login')
  if (guest && authState.loggedIn) return next('/')

  // Set Title
  setTitle(to)

  // Next
  next()
}

export { setTitle, routerGuard }
