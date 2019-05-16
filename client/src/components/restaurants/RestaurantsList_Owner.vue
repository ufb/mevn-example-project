<template>
  <v-expansion-panel>
    <restaurants-list-item-owner
      v-for="restaurant in restaurants"
      :key="restaurant._id"
      :restaurant="restaurant"
      :user="user"
    ></restaurants-list-item-owner>
  </v-expansion-panel>
</template>

<script>
import RestaurantsListItem_Owner from './RestaurantsListItem_Owner.vue';

export default {
  name: 'restaurant-list-owner',

  components: {
    'restaurants-list-item-owner': RestaurantsListItem_Owner
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
