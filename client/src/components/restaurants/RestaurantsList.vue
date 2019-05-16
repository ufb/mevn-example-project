<template>
  <v-list two-line>
    <restaurant-list-item
      v-for="restaurant in restaurants"
      :key="restaurant._id"
      :restaurant="restaurant"
      :user="user"
    ></restaurant-list-item>
  </v-list>
</template>

<script>
import RestaurantsListItem from './RestaurantsListItem.vue';

export default {
  name: 'restaurant-list',
  components: {
    'restaurant-list-item': RestaurantsListItem
  },
  props: {
    restaurants: {
      type: Array,
      required: true
    },
    user: {
      type: Object,
      required: false
    }
  }
}
</script>
