import { axios } from '../services/api.service';

const StoreModule_Restaurants = {

  namespaced: true,

  state: {
    restaurants: [],
    ownRestaurants: []
  },
  mutations: {
    setRestaurants(state, { restaurants, own }) {
      const field = own ? 'ownRestaurants' : 'restaurants';
      state[field] = restaurants;
    },
    addRestaurant(state, restaurant) {
      state.restaurants.push(restaurant);
      state.ownRestaurants.push(restaurant);
    },
    updateRestaurant(state, { restaurant, remove }) {
      const id = restaurant._id;
      let found;
      ['restaurants', 'ownRestaurants'].forEach(field => {
        const copy = [...state[field]];
        const index = copy.findIndex(r => r._id === id);
        if (index !== -1) {
          found = true;
          if (remove) copy.splice(index, 1);
          else copy[index] = restaurant;
          state[field] = copy;
        }
      });
      if (!found && !remove) {
        state.restaurants.push(restaurant);
      }
    },
    removeRestaurants(state) {
      state.restaurants = [];
      state.onwRestaurants = [];
    }
  },

  actions: {
    fetchRestaurants({ commit }) {
      const route = this.state.route;
      const own = route.query && route.query.own;

      return axios.get(`${this.state.route.fullPath}`)
        .then(response => {
          const restaurants = response.data;
          commit('setRestaurants', { restaurants, own });
        });
    },
    fetchReviews({ commit }, id) {
      return axios.get(`restaurants/${id}/reviews`)
        .then(response => commit('updateRestaurant', { restaurant: response.data }));
    },
    sendRestaurant({ commit }, restaurant) {
      return axios.post('restaurants', restaurant)
        .then(response => commit('addRestaurant', response.data)).catch(err => err);
    },
    removeRestaurant({ commit }, sid) {
      return axios.delete(`restaurants/${sid}`)
        .then(() => commit('updateRestaurant', { restaurant: { _id: sid }, remove: true })).catch(err => err);
    },
    removeRestaurants({ commit }) {
      return axios.delete('restaurants')
        .then(() => commit('removeRestaurants')).catch(err => err);
    },
    updateRestaurant({ commit }, { restaurant }) {
      return axios.put(`restaurants/${restaurant._id}`, restaurant)
        .then(response => commit('updateRestaurant', { restaurant: response.data })).catch(err => err);
    },
    sendReview({ commit }, { review, sid }) {
      return axios.post(`restaurants/${sid}/reviews`, review)
        .then(response => commit('updateRestaurant', { restaurant: response.data })).catch(err => err);
    },
    removeReview({ commit }, { sid, vid }) {
      return axios.delete(`restaurants/${sid}/reviews/${vid}`)
        .then(response => commit('updateRestaurant', { restaurant: response.data })).catch(err => err);
    },
    removeReviews({ commit }, sid) {
      return axios.delete(`restaurants/${sid}/reviews`)
        .then(response => commit('updateRestaurant', { restaurant: response.data })).catch(err => err);
    },
    updateReview({ commit }, { review, sid }) {
      return axios.put(`restaurants/${sid}/reviews/${review._id}`, review)
        .then(response => commit('updateRestaurant', { restaurant: response.data })).catch(err => err);
    },
    sendReply({ commit }, { reply, sid, vid }) {
      return axios.post(`restaurants/${sid}/reviews/${vid}/reply`, { reply })
        .then(response => commit('updateRestaurant', { restaurant: response.data })).catch(err => err);
    }
  },
  getters: {
    getAll(state) {
      return state.restaurants || [];
    },
    getOwn(state) {
      return state.ownRestaurants || [];
    },
    get: state => id => {
      return state.restaurants.find(r => r._id === id) || {};
    }
  }
};
export default StoreModule_Restaurants;
