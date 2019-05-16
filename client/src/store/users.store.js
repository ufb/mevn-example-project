import userService from '../services/user.service';
import { axios } from '../services/api.service';
import { storageService } from '../services/client-storage.service';

const StoreModule_Users = {

  namespaced: true,

  state: {
    user: userService.from(storageService.get('token')),
    users: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUsers(state, users) {
      state.users = users;
    },
    updateUser(state, { user, remove }) {
      const clone = [...state.users];
      const index = clone.findIndex(u => u._id === user._id);
      if (index !== -1) {
        if (remove) clone.splice(index, 1);
        else clone[index] = user;
        state.users = clone;
      }
    },
    removeUsers(state) {
      state.users = [];
    }
  },
  actions: {
    login({ commit }, auth) {
      return axios.get('users/self', { auth })
        .then(() => commit('setUser', userService.from(storageService.get('token'))))
        .catch(() => commit('setUser', null));
    },
    register({ commit }, data) {
      return axios.post('users', data)
        .then(() => commit('setUser', userService.from(storageService.get('token'))))
        .catch(() => commit('setUser', null));
    },
    logout({ commit }) {
      commit('setUser', null);
      storageService.clear();
    },
    fetchUsers({ commit }) {
      return axios.get(`${this.state.route.fullPath}`)
        .then(response => commit('setUsers', response.data)).catch(err => err);
    },
    removeUser({ commit }, id) {
      return axios.delete(`users/${id}`)
        .then(() => commit('updateUser', { user: { _id: id }, remove: true })).catch(err => err);
    },
    removeUsers({ commit }) {
      return axios.delete('users')
        .then(() => commit('removeUsers')).catch(err => err);
    },
    updateUser({ commit }, user) {
      return axios.put(`users/${user._id}`, user)
        .then(response => commit('updateUser', { user: response.data })).catch(err => err);
    }
  },
  getters: {
    getUsers(state) {
      return state.users || [];
    },
    getUser(state) {
      return state.user || null;
    },
    user: state => () => {
      return state.user || null;
    }
  }
};
export default StoreModule_Users;
