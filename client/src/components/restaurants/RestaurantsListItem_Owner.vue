<template>
  <v-expansion-panel-content>
    <div slot="header">
      <div
        class="left pt-1 subheading"
      >{{ restaurant.name }}</div>
      <router-link class="left mr-0" :to="'/restaurants/' + restaurant._id">
        <v-tooltip top color="dark" lazy>
          <v-btn
            slot="activator"
            color="primary"
            icon
            flat
            height="23"
            class="right mt-2 mb-0 ml-1 small-btn"
          ><v-icon>visibility</v-icon>
          </v-btn>
          <span>Open detail view of restaurant {{ restaurant.name }}</span>
        </v-tooltip>
      </router-link>
      <v-rating
        v-show="rating(restaurant)"
        half-increments
        color="accent"
        small
        class="right mx-4"
        :value="rating(restaurant) || 0"
        readonly
      ></v-rating>
    </div>
    <v-subheader>{{ restaurant.address }}</v-subheader>
    <v-card>
      <v-card-title primary-title class="accent--text pt-5 subheading">
        Reviews pending to reply:
      </v-card-title>
    </v-card>
    <v-list v-if="pendingReviews.length">
      <review-owner
        v-for="review in pendingReviewsSliced"
        :key="review._id"
        :review="review"
      ></review-owner>
      <v-btn
        v-if="!showAll && pendingReviews.length > 10"
        color="tertiary"
        @click="showAll = true"
      >show all</v-btn>
    </v-list>
    <div v-else class="mb-4">No reviews pending to reply!</div>
  </v-expansion-panel-content>
</template>

<script>
import Review_Onwer from './Review_Owner.vue';

export default {
  name: 'restaurant-list-item-owner',

  data() {
    return {
      showAll: false
    };
  },

  components: {
    'review-owner': Review_Onwer
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
  computed: {
    pendingReviews() {
      const restaurant = this.restaurant;
      if (!restaurant.reviews) return [];
      return restaurant.reviews.filter(r => !r.reply);
    },
    pendingReviewsSliced() {
      if (this.showAll) return this.pendingReviews;
      return this.pendingReviews.slice(0, 10);
    }
  },
  methods: {
    rating(restaurant) {
      return restaurant.ratingsSum / restaurant.ratingsCount;
    }
  }
}
</script>
