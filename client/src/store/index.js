import Vue from 'vue'
import Vuex from 'vuex'

import users from './users.store'
import restaurants from './restaurants.store'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    restaurants
  }
})
