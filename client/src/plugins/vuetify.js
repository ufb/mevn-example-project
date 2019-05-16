import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#50816B',
    secondary: '#506681',
    tertiary: '#606060',
    accent: '#c3d9d1',
    error: '#c66',
    info: '#abc',
    dark: '#303030',
    card: '#424242',
    white: '#fff',
    grey: '#ccc'
  },
  customProperties: true,
  iconfont: 'md'
})
