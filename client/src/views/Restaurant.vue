<template>
  <list>
    <template slot="toolbar-primary">
      <v-flex xs12 sm7>
        <v-toolbar-title>
          {{ restaurant.name }}
        </v-toolbar-title>
      </v-flex>
      <v-flex xs12 sm4 offset-sm1>
        <template v-if="restaurant.avgRating">
          <v-rating
            half-increments
            color="#fff"
            :value="restaurant.avgRating"
            readonly
            class="right"
          ></v-rating>
          <br>
          <span class="clear accent--text right caption">Rating: {{ restaurant.avgRating.toString().slice(0, 4) }}</span>
        </template>
        <span v-else class="right">Not rated yet</span>
      </v-flex>
    </template>
    <template slot="toolbar-secondary">
      <v-toolbar-title class="subheading px-0">
        Adress:
        <v-subheader class="d-inline white--text">{{ restaurant.address }}</v-subheader>
      </v-toolbar-title>
    </template>
    <template slot="list">
      <v-layout wrap align-end class="px-2">
        <template v-if="!form">
          <v-flex xs8>
            <v-subheader primary-title class="mt-2 accent--text subheading">
              Reviews:
            </v-subheader>
          </v-flex>
          <v-flex xs3 offset-xs1>
            <v-btn
              v-if="user && user.role === 'user'"
              color="secondary"
              class="right mr-4 mt-4"
              @click="form = true"
            >
              <v-icon>add</v-icon> &nbsp;review
            </v-btn>
            <v-dialog
              v-if="reviews && reviews.length && user && user.role === 'admin'"
              v-model="dialog"
              width="280"
              class="right"
              light
            >
              <v-btn
                v-if="reviews && reviews.length"
                slot="activator"
                color="error"
                small
                outline
                class="mr-4 mt-4"
              ><v-icon>close</v-icon> remove all</v-btn>
              <v-card>
                <v-card-text>
                  Remove ALL REVIEWS of restaurant {{ restaurant.name }} from database?
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
        <v-flex xs12 v-else>
          <v-form ref="form" class="px-4 py-4">
            <v-rating
              color="accent"
              :value="rating"
              name="rating"
              v-model="rating"
              :rules="ratingRules"
              required
            ></v-rating>
            <div v-if="validated && !rating" class="v-text-field__details">
              <div class="v-messages theme--dark error--text">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">Please rate the restaurant.</div>
                </div>
              </div>
            </div>
            <br>
            <v-textarea
              name="comment"
              :rules="commentRules"
              :counter="500"
              v-model="comment"
              @keyup.enter="submitReview"
              label="Comment"
              box
              autofocus
              required
            ></v-textarea>
            <v-btn
              color="tertiary"
              class="px-2"
              @click="form = false; rating = 0; comment = ''"
            >Cancel</v-btn>
            <v-btn
              color="tertiary"
              class="px-2"
              @click="rating = 0; comment = ''"
            >Clear</v-btn>
            <v-btn
              color="secondary"
              @click="submitReview"
            >Submit</v-btn>
          </v-form>
        </v-flex>
      </v-layout>

      <div v-if="!reviews || !count" class="mb-2 ml-5">No reviews yet<br><br><br></div>

      <template v-else>
        <template v-if="count > 1">
          <v-list class="px-2 mt-4">
            <v-subheader class="white--text border px-0 mx-4">Review with highest rating:</v-subheader>
            <review :review="review_highest"></review>
          </v-list>
          <v-list class="px-2">
            <v-subheader class="white--text border px-0 mx-4">Review with lowest rating:</v-subheader>
            <review :review="review_lowest"></review>
          </v-list>
        </template>
        <review v-else :review="review_highest" class="mt-4 mb-4"></review>
        <v-list v-if="count < 3" class="px-2">
          <v-subheader class="white--text px-0 mx-4 mb-4">No other reviews yet</v-subheader>
        </v-list>
        <v-list v-else-if="count > 1" class="px-2">
          <v-subheader class="white--text border px-0 mx-4">Last 5 reviews:</v-subheader>
          <review v-for="review in reviews_sliced" :key="review._id" :review="review"></review>
          <v-btn
            v-if="!showAll && reviews.length > 5"
            color="tertiary"
            @click="showAll = true"
            class="ml-4"
          >show all</v-btn>
        </v-list>

      </template>
    </template>
  </list>
</template>

<script>
import List from '../components/List.vue';
import Review from '../components/restaurants/Review.vue';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  name: 'restaurant',
  components: {
    list: List,
    review: Review
  },

  mixins: [validationMixin],

  validations: {
    comment: { required, minLength: minLength(1), maxLength: maxLength(500) },
    rating: { minValue: minValue(1), maxValue: maxValue(5) }
  },

  data() {
    return {
      ratingRules: [() => {
        if(!this.$v.rating.required) return 'Please rate the restaurant.';
        return true;
      }],
      commentRules: [() => {
        let msg = '';
        if (!this.$v.comment.required) msg += 'Please leave a comment. ';
        else if(!this.$v.comment.minLength || !this.$v.comment.maxLength) msg += 'Comment must contain between 1 and 500 characters!';
        return msg || true;
      }],
      id: '',
      form: false,
      comment: '',
      rating: 0,
      validated: false,
      dialog: false,
      showAll: false
    }
  },
  props: {
    route: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/getUser'
    }),
    restaurant() {
      return this.$store.getters['restaurants/get'](this.id);
    },
    reviews() {
      if (!this.restaurant || !this.restaurant.reviews) return [];
      const reviews = this.restaurant.reviews.slice();
      return reviews.sort((r1, r2) => r1.created < r2.created ? 1 : -1);
    },
    count() {
      return this.reviews ? this.reviews.length : 0;
    },
    reviews_sliced() {
      return this.reviews.slice(0, this.showAll ? this.count - 1 : 5);
    },
    review_highest() {
      return this.reviews.slice().sort((r1, r2) => r1.rating < r2.rating ? 1 : -1)[0];
    },
    review_lowest() {
      return this.reviews.slice().sort((r1, r2) => r1.rating < r2.rating ? 1 : -1)[this.count - 1];
    }
  },
  methods: {
    submitReview() {
      this.$refs.form.validate();
      this.validated = true;

      if (!this.$v.$invalid) {
        this.$store.dispatch('restaurants/sendReview', {
          review: { rating: this.rating, comment: this.comment },
          sid: this.restaurant._id.toString()
        })
        .then(() => {
          this.form = false;
          this.rating = 0;
          this.comment = '';
        });
      }
    },
    submitDelete() {
      const id = this.restaurant._id;
      this.$store.dispatch('restaurants/removeReviews', id)
        .then(() => {
          this.dialog = false;
          this.$store.dispatch('restaurants/fetchReviews', id);
        });
    }
  },
  mounted() {
    const id = this.id = this.$router.history.current.params.id;
    this.$store.dispatch('restaurants/fetchReviews', id);
  }
}
</script>
