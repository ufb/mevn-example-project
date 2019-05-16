import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store/'
import messengerService from '../services/messenger.service'

Vue.use(Router);

const router = new Router({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach((to, from, next) => {
  const user = store.getters['users/user']();

  if (!user && to.meta.auth) {
    messengerService('Redirect: You need to log-in first.');
    next('/login');
  }
  else if (to.meta.adminOnly && (!user || user.role !== 'admin')) {
    messengerService('Redirect: Unauthorized page access attempt.');
    next('/restaurants');
  } else {
    document.title = to.meta.title + ' - fullREST';
    next();
  }
});

export default router;
