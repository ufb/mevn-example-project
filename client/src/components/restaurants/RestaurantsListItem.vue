<template>
  <v-list-tile class="py-2 px-0 mx-4 mb-2">
    <v-layout wrap>
      <v-flex xs12 v-if="edit">
        <v-form ref="form">
          <v-text-field
            :placeholder="restaurant.name"
            name="name"
            :rules="nameRules"
            :counter="50"
            v-model.trim="name"
            validate-on-blur
          ></v-text-field>
          <v-text-field
            :placeholder="restaurant.address"
            name="address"
            :rules="addressRules"
            :counter="150"
            v-model.trim="address"
            validate-on-blur
          ></v-text-field>
          <v-btn
            color="secondary"
            @click="submitEdit"
            class="left"
          >Submit</v-btn>
          <v-btn
            color="tertiary"
            @click="edit = false; name = ''; address = ''"
          >Cancel</v-btn>
          <v-btn
            color="tertiary"
            @click="name = ''; address = ''"
            class="left"
          >Clear</v-btn>
        </v-form>
      </v-flex>
      <template v-else>
        <v-flex xs8 sm8>
          <v-list-tile-content>
            <router-link :to="'/restaurants/' + restaurant._id">
              <v-tooltip top color="dark" lazy>
                <v-btn
                  slot="activator"
                  color="primary"
                  icon
                  flat
                  height="23"
                  class="left mt-1 mb-0 ml-0 small-btn"
                ><v-icon>visibility</v-icon>
                </v-btn>
                <span>Open detail view of restaurant {{ restaurant.name }}</span>
              </v-tooltip>
              <div class="restaurant-title left ml-2">
                <v-list-tile-title class="subheading white--text">{{ restaurant.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ restaurant.address }}</v-list-tile-sub-title>
              </div>
            </router-link>
          </v-list-tile-content>
        </v-flex>
        <v-flex xs4 sm3 offset-sm1>
          <v-rating
            v-show="rating(restaurant)"
            half-increments
            color="accent"
            small
            :value="rating(restaurant) || 0"
            readonly
            class="right"
          ></v-rating>

          <v-dialog
            v-if="user && user.role === 'admin'"
            v-model="dialog"
            width="280"
            class="right clear"
            light
          >
            <v-btn
              slot="activator"
              color="error"
              fab
              small
              outline
              class="right mr-0"
            ><v-icon>close</v-icon></v-btn>
            <v-card>
              <v-card-text>
                Remove restaurant {{ restaurant.name }} from database?
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

          <br v-else class="clear">

          <v-tooltip
            top
            color="dark"
            lazy
          >
            <v-btn
              v-if="user && user.role === 'admin'"
              slot="activator"
              color="secondary"
              fab
              small
              depressed
              class="right mr-0"
              @click="edit = !edit"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Edit restaurant {{ restaurant.name }}</span>
          </v-tooltip>
        </v-flex>
      </template>
    </v-layout>
  </v-list-tile>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'restaurant-list',

  mixins: [validationMixin],

  validations: {
    name: { minLength: minLength(2), maxLength: maxLength(50) },
    address: { minLength: minLength(2), maxLength: maxLength(150) }
  },
  data() {
    return {
      nameRules: [() => {
        let msg = '';
        if(!this.$v.name.minLength || !this.$v.name.maxLength) msg += 'Must contain between 2 and 50 characters!';
        return msg || true;
      }],
      addressRules: [() => {
        let msg = '';
        if(!this.$v.address.minLength || !this.$v.address.maxLength) msg+= 'Must contain between 2 and 150 characters!';
        return msg || true;
      }],
      edit: false,
      dialog: false,
      name: '',
      address: ''
    };
  },
  props: {
    restaurant: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: false
    }
  },
  methods: {
    rating() {
      return this.restaurant.ratingsSum / this.restaurant.ratingsCount;
    },
    submitDelete() {
      this.$store.dispatch('restaurants/removeRestaurant', this.restaurant._id);
    },
    submitEdit() {
      if (!this.$v.$invalid) {

        const restaurant = this.restaurant;

        this.$store.dispatch('restaurants/updateRestaurant', {
          restaurant: {
            _id: restaurant._id,
            name: this.name || restaurant.name,
            address: this.address || restaurant.address
          }
        })
        .then(() => {
          this.edit = false;
          this.$store.dispatch('restaurants/fetchRestaurants');
        });
      }
    }
  }
}
</script>
