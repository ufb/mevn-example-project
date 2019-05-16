import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import { storageService } from './client-storage.service';
import messengerService from './messenger.service';
import { socket } from './socket.io.service';
import { API_URL } from '../config';

const axios = Axios.create({
  baseURL: API_URL,
  responseType: 'json'
});

axios.interceptors.request.use(config => {
  const token = storageService.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(response => {
  const token = response.data ? response.data.token : response.token;

  if (token) storageService.set('token', token);

  if (socket && response.status === 200 && ['post', 'put', 'delete'].includes(response.config.method)) {

    const url = response.config.url;
    const resource = url.search('restaurant') !== -1 ? 'restaurants' : 'users';

    socket.emit('success', resource);
  }
  return response;
}, err => Promise.reject(messengerService(err)));

Vue.use(VueAxios, axios);

export { axios };
