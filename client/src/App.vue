<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        dark
        absolute
        floating
        right
        hide-overlay
        v-if="drawer && user && user.role === 'admin'"
        height="calc(100vh - 64px)"
      >
        <nav id="admin-bar">
          <router-link to="/login" class="accent--text">
            <v-btn color="tertiary">Login</v-btn>
          </router-link><br>
          <router-link to="/register" class="accent--text">
            <v-btn color="tertiary">Register</v-btn>
          </router-link><br>
          <router-link to="/restaurants" class="accent--text">
            <v-btn color="tertiary">Restaurants</v-btn>
          </router-link><br>
          <router-link to="/users" class="accent--text">
            <v-btn color="tertiary">Users</v-btn>
          </router-link>
        </nav>
      </v-navigation-drawer>
      <messenger></messenger>
      <v-toolbar app color="dark" class="elevation-0">
        <h1 left clipped app>
          <!-- <v-img alt="Logo Open Restaurants" src="./img/logo.svg"></v-img>  -->
          <img alt="Logo Open Restaurants" src="./assets/logo.png">
          <span class="primary--text d-inline-block" :class="{'d-none': $vuetify.breakpoint.xs }"><span>full</span>REST</span>
        </h1>
        <v-spacer></v-spacer>
        <v-btn
          v-if="content === 'restaurant'"
          color="primary"
          class="my-0 mr-2"
          to="/restaurants"
        ><v-icon>navigate_before</v-icon> &nbsp;to list
        </v-btn>
        <v-btn
          v-if="content === 'restaurants' && user && user.role === 'owner'"
          color="primary"
          class="my-0 mx-0"
          :to="`/restaurants${queryString}`"
          :key="$route.fullPath"
        >{{ queryBtnText }}</v-btn>
        <logout v-if="user" right clipped app></logout>
        <v-btn
          v-if="user && user.role === 'admin'"
          color="tertiary"
          id="adminbar-toggle"
          @click.stop="drawer = !drawer"
          class="px-2"
        >
          <v-icon>menu</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content id="content" :class="{'v-content--xs': $vuetify.breakpoint.xs }">
        <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import Logout from './components/Logout.vue';
  import Messenger from './components/Messenger.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    data() {
      return {
        drawer: true,
        query: null,
        content: ''
      };
    },
    components: {
      logout: Logout,
      messenger: Messenger
    },
    computed: {
      ...mapGetters({
        user: 'users/getUser'
      }),
      queryBtnText() {
        return this.query && this.query.own ? 'show all' : 'show own';
      },
      queryString() {
        return this.query && this.query.own ? '' : '?own=true';
      }
    },
    methods: {
      setRouteInfos(to) {
        this.query = to.query;
        this.content = to.name;
      }
    },
    watch: {
      $route: 'setRouteInfos'
    },
    mounted() {
      this.setRouteInfos(this.$route);
    }
  }
</script>

<style lang="scss">
  @import './sass/index';
</style>
