export default [
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ './../views/Login.vue'),
    meta: { title: 'Login' }
  }, {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ './../views/Register.vue'),
    meta: { title: 'Register' }
  }, {
    path: '/restaurants',
    name: 'restaurants',
    component: () => import(/* webpackChunkName: "restaurants" */ './../views/Restaurants.vue'),
    //props: route => ({ query: route.query }),
    meta: { title: 'Restaurants List', auth: true }
  }, {
    path: '/restaurants/:id',
    name: 'restaurant',
    component: () => import(/* webpackChunkName: "restaurant" */ './../views/Restaurant.vue'),
    props: (route) => ({ route }),
    meta: { title: 'Detail View', auth: true }
  }, {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "users" */ './../views/Users.vue'),
    meta: { title: 'Users', auth: true, adminOnly: true }
  }, {
    path: '/:anything',
    name: 'error',
    component: () => import(/* webpackChunkName: "users" */ './../views/404.vue'),
    meta: { title: '404 - Page not found' }
  }
]
