<template>
  <list :tb2="pages > 1 || (user && user.role !== 'user')" :tb3="pages > 1">
    <template slot="toolbar-primary">
      <template v-if="restaurants.length">
        <v-flex xs12 sm5>
          <v-toolbar-title>
            <span v-if="query && query.own">My</span> Restaurants
          </v-toolbar-title>
        </v-flex>
        <v-flex xs5 sm2 offset-sm1>
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
        <v-flex xs5 offset-xs2 sm3 offset-sm1>
          <v-tooltip top color="dark" lazy>
            <v-range-slider
              slot="activator"
              :value="[0, 5]"
              min="0"
              max="5"
              hide-details
              track-color="transparent"
              thumb-color="#fff"
              v-model="filtered"
              append-icon="filter_list"
              @change="changeRoute"
            >
            </v-range-slider>
            <span>Filter by rating</span>
          </v-tooltip>
        </v-flex>
      </template>
      <template v-else-if="loading">
        <v-flex xs12>
          <v-progress-circular
            indeterminate
            color="#fff"
          ></v-progress-circular>
        </v-flex>
      </template>
      <template v-else>
        <v-flex xs12>
          <v-toolbar-title>No restaurants found.</v-toolbar-title>
        </v-flex>
      </template>
    </template>
    <template slot="toolbar-secondary">
      <template v-if="!form">
        <v-flex xs6>
          <v-pagination
            v-if="pages > 1"
            v-model="page"
            :length="pages"
          ></v-pagination>
        </v-flex>
        <v-flex xs5 offset-xs1 v-if="user && user.role === 'owner'">
          <v-btn
            class="right"
            color="secondary"
            @click="form = !form"
          >
            <v-icon>add</v-icon> &nbsp;new restaurant
          </v-btn>
        </v-flex>
        <v-flex xs5 offset-xs1 v-else-if="user && user.role === 'admin'">
          <v-dialog
            v-model="dialog"
            width="280"
            class="right"
            light
          >
            <v-btn
              v-if="restaurants && restaurants.length"
              slot="activator"
              color="error"
              small
              outline
              class="right mr-0"
            >remove all</v-btn>
            <v-card>
              <v-card-text>
                Remove ALL RESTAURANTS from database?
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
        <v-flex xs3 offset-xs1 v-else>
        </v-flex>
      </template>
      <v-flex xs12 v-else>
        <v-form ref="form">
          <v-card-text>
            <v-text-field
              placeholder="Restaurant name"
              name="name"
              :rules="nameRules"
              :counter="50"
              v-model="name"
              required
            ></v-text-field>
            <v-text-field
              placeholder="Restaurant address"
              name="address"
              :rules="addressRules"
              :counter="150"
              v-model="address"
              required
            ></v-text-field>
            <v-btn
              color="secondary"
              @click="submitRestaurant"
            >Submit</v-btn>
            <v-btn
              color="tertiary"
              @click="form = false; name = ''; address = ''"
            >Cancel</v-btn>
            <v-btn
              color="tertiary"
              @click="name = ''; address = ''"
            >Clear</v-btn>
          </v-card-text>
        </v-form>
      </v-flex>
    </template>
    <template slot="list">
      <keep-alive v-if="restaurants">
        <component :is="view" :restaurants="slicedRestaurants" :user="user"></component>
      </keep-alive>
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
import RestaurantsList from '../components/restaurants/RestaurantsList.vue';
import RestaurantsList_Owner from '../components/restaurants/RestaurantsList_Owner.vue';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapGetters, mapState } from 'vuex';
import Bus from '../services/event.service';

export default {
  name: 'restaurants',
  components: {
    list: List,
    'restaurants-list': RestaurantsList,
    'restaurants-list-owner': RestaurantsList_Owner
  },
  mixins: [validationMixin],
  validations: {
    name: { required, minLength: minLength(2), maxLength: maxLength(50) },
    address: { required, minLength: minLength(2), maxLength: maxLength(150) }
  },
  data() {
    return {
      nameRules: [() => {
        let msg = '';
        if (!this.$v.name.required) msg+= 'Please fill out this field. ';
        if(!this.$v.name.minLength || !this.$v.name.maxLength) msg += 'Must contain between 2 and 50 characters!';
        return msg || true;
      }],
      addressRules: [() => {
        let msg = '';
        if (!this.$v.address.required) msg+= 'Please fill out this field. ';
        if(!this.$v.address.minLength || !this.$v.address.maxLength) msg+= 'Must contain between 2 and 50 characters!';
        return msg || true;
      }],
      loading: true,
      sortItems: [{
          text: 'Sort',
          value: '',
          disabled: true
        }, {
        text: 'Rating',
        value: 'rating'
      }, {
        text: 'A-Z',
        value: 'az'
      }, {
        text: 'Z-A',
        value: 'za'
      }],
      stars: ['-', 1, 2, 3, 4, 5],
      sorted: 'rating',
      filtered: [0, 5],
      page: 1,
      pp: 10,
      query: null,
      name: '',
      address: '',
      form: false,
      dialog: false,
      silent: false
    };
  },
  computed: {
    ...mapGetters({
      user: 'users/getUser'
    }),
    ...mapState({
      restaurants(state, getters) {
        const which = this.query && this.query.own ? 'getOwn' : 'getAll';
        return getters[`restaurants/${which}`];
      }
    }),
    filteredRestaurants() {
      const filter = this.filtered;
      const sorted = this.sorted;

      return this.restaurants
        .concat()
        .filter(r => {
          const rating = r.avgRating || 0;
          return rating >= filter[0] && rating <= filter[1];
        })
        .sort((r1, r2) => {
          if (sorted === 'rating') return r1.avgRating < r2.avgRating ? 1 : -1;
          if (sorted === 'az') return r1.name.toLowerCase() > r2.name.toLowerCase() ? 1 : -1;
          return r2.name.toLowerCase() > r1.name.toLowerCase() ? 1 : -1;
        });
    },
    slicedRestaurants() {
      const first = this.pp * (this.page - 1);

      return this.filteredRestaurants
        .slice(first, first + this.pp);
    },
    count() {
      return this.filteredRestaurants.length;
    },
    pages() {
      return Math.ceil(this.count / this.pp);
    },
    view() {
      return this.query && this.query.own ? 'restaurants-list-owner' : 'restaurants-list';
    }
  },
  methods: {
    fetchRestaurants(to) {
      if (this.silent) return; // no need for a request: already have all we need
      if (to) {
        const query = to.query;
        this.query = query;
        if (query.sort) this.sorted = query.sort;
        if (query.rating) this.rating = JSON.parse(query.rating);
        if (query.page) this.page = query.page*1;
      }
      this.loading = true;
      this.$store.dispatch('restaurants/fetchRestaurants').then(() => this.loading = false);
    },
    submitRestaurant() {
      this.$refs.form.validate();

      if (!this.$v.$invalid) {
        this.$store.dispatch('restaurants/sendRestaurant', {
          name: this.name,
          address: this.address
        })
        .then(() => {
          this.name = '';
          this.address = '';
          this.form = false;
          this.fetchRestaurants();
        });
      }
    },
    submitDelete() {
      this.$store.dispatch('restaurants/removeRestaurants').then(() => this.dialog = false);
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
        
        const own = this.$route.query.own ? 'onw=true' : '';
        const sort = `sort=${this.sorted}`;
        const filter = `rating=[${this.filtered}]`;
        const page = `page=${this.page}`;

        this.$router.push(`/restaurants?${sort}&${filter}&${page}&${own}`);

        Vue.nextTick(() => this.silent = false);
      });
    }
  },
  watch: {
    $route: 'fetchRestaurants',
    page: 'changeRoute'
  },
  mounted() {
    this.fetchRestaurants(this.$route);
    Bus.$on('DB:updated:restaurants', this.fetchRestaurants());
  }
}
</script>
