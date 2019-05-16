<template>
  <list :tb2="pages > 1 || (user && user.role !== 'user')" :tb3="pages > 1">
    <template slot="toolbar-primary">
      <template v-if="users && users.length">
        <v-flex xs12 sm3>
          <v-toolbar-title>
            Users
          </v-toolbar-title>
        </v-flex>
        <v-flex xs12 sm3 offset-sm1>
          <v-select
            :items="sortItems"
            dense
            flat
            height="22"
            append-icon="sort"
            v-model="sorted"
            @change="changeRoute"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm4 offset-sm1>
          <v-select
            :items="filterItems"
            dense
            flat
            height="22"
            append-icon="filter_list"
            v-model="filtered"
            @change="changeRoute"
          ></v-select>
        </v-flex>
      </template>
      <v-flex xs12 v-else-if="loading">
        <v-progress-circular
          indeterminate
          color="#fff"
        ></v-progress-circular>
      </v-flex>
      <v-flex xs12 v-else>
        <v-toolbar-title>No users found.</v-toolbar-title>
      </v-flex>
    </template>
    <template slot="toolbar-secondary">
      <v-flex xs8>
        <v-pagination
          v-if="pages > 1"
          v-model="page"
          :length="pages"
        ></v-pagination>
      </v-flex>
      <v-flex xs3 offset-xs1>
        <v-dialog
          v-model="dialog"
          width="280"
          class="right"
          light
        >
          <v-btn
            v-if="users && users.length"
            slot="activator"
            color="error"
            small
            outline
            class="right mr-0"
          >remove all</v-btn>
          <v-card>
            <v-card-text>
              Remove ALL USERS from database?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="tertiary"
                flat="flat"
                @click="dialog = false"
              >
                Cancel
              </v-btn>

              <v-btn
                color="secondary"
                flat="flat"
                @click="submitDelete"
              >
                confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </template>
    <template slot="list">
      <v-list two-line>
        <user v-for="user in slicedUsers" :key="user._id" :user="user"></user>
      </v-list>
    </template>
    <template slot="toolbar-tertiary">
      <v-flex xs12>
        <v-pagination
          v-model="page"
          :length="pages"
        ></v-pagination>
      </v-flex>
    </template>
  </list>
</template>

<script>
import Vue from 'vue';
import List from '../components/List.vue';
import User from '../components/User.vue';
import { mapGetters } from 'vuex';
import Bus from '../services/event.service';

export default {
  name: 'users',
  components: {
    list: List,
    user: User
  },
  data() {
    return {
      loading: true,
      sortItems: [{
          text: 'E-mail: A-Z',
          value: 'az'
        }, {
          text: 'Created',
          value: 'created'
        }, {
          text: 'Role',
          value: 'role'
      }],
      filterItems: [{
          text: 'Filter by role',
          value: '',
          disabled: true
        }, {
          text: 'Show all',
          value: ' '
        }, {
          text: 'Admin',
          value: 'admin'
        }, {
          text: 'Owner',
          value: 'owner'
        }, {
          text: 'Regular User',
          value: 'user'
      }],
      sorted: 'created',
      filtered: '',
      page: 1,
      pp: 10,
      dialog: false,
      silent: false
    };
  },
  computed: {
    ...mapGetters({
      user: 'users/getUser',
      users: 'users/getUsers'
    }),
    sortedUsers() {
      const filter = this.filtered;
      const sorted = this.sorted;

      return this.users
        .concat()
        .filter(r => !filter || r.role === filter || filter === ' ')
        .sort((u1, u2) => {
          if (sorted === 'created') return u1[sorted] > u2[sorted] ? -1 : 1;
          return u1[sorted] > u2[sorted] ? 1 : -1;
        });
    },
    slicedUsers() {
      const first = this.pp * (this.page - 1);

      return this.sortedUsers
        .slice(first, first + this.pp);
    },
    count() {
      return this.sortedUsers.length;
    },
    pages() {
      return Math.ceil(this.count / this.pp);
    }
  },
  methods: {
    fetchUsers(to) {
      if (this.silent) return; // no need for a request: already have all we need
      if (to) {
        const query = to.query;
        this.query = query;
        if (query.sort) this.sorted = query.sort;
        if (query.role) this.filtered = query.role;
        if (query.page) this.page = query.page*1;
      }
      this.loading = true;
      this.$store.dispatch('users/fetchUsers').then(() => this.loading = false);
    },
    submitDelete() {
      this.$store.dispatch('users/removeUsers').then(() => this.dialog = false)
        .then(() => this.logout());
    },
    logout() {
      this.$store.dispatch('users/logout');
      this.$router.replace(this.$route.query.redirect || '/login');
    },
    adjustPage() {
      if (this.count <= (this.page - 1) * this.pp) {
        this.page = Math.floor(this.count / this.pp) + 1;
      }
    },
    changeRoute() {
      this.silent = true;

      Vue.nextTick(() => {
        this.adjustPage();

        const sort = `sort=${this.sorted}`;
        const filter = `role=${this.filtered}`;
        const page = `page=${this.page}`;

        this.$router.push(`/users?${sort}&${filter}&${page}`);

        Vue.nextTick(() => this.silent = false);
      });
    }
  },
  watch: {
    $route: 'fetchUsers',
    page: 'changeRoute'
  },
  mounted() {
    this.fetchUsers(this.$route);
    Bus.$on('DB:updated:restaurants', this.fetchUsers());
  }
}
</script>
