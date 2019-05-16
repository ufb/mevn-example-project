import '@babel/polyfill';//use useBuiltIns: 'usage' not recommended by cli-3, when working with vuetify
import Vue from 'vue';
import { axios } from './services/api.service';
import { DEV } from './config';
import './plugins/vuetify';
import App from './App.vue';

import Vuetify, {
  VApp,
  VNavigationDrawer,
  VToolbar,
  VBtn,
  VIcon
} from 'vuetify/lib';

import router from './router/router';
import { sync } from 'vuex-router-sync';
import store from './store/index';

//import './sass/index.scss';
//import './../node_modules/vuetify/dist/vuetify.min.css'
// import './../node_modules/roboto-fontface/css/roboto/roboto-fontface.css'
// import './../node_modules/material-design-icons-iconfont/dist/material-design-icons.css'

//Vue.config.productionTip = false;
Vue.config.devtools = true;

sync(store, router);

Vue.use(Vuetify, {
  components: {
    VApp, VNavigationDrawer, VToolbar, VBtn, VIcon
  }
});

const app = new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app');

if (DEV) window.__app__ = app
