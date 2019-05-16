<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="error">
            <v-toolbar-title>Error 404 - page not found.</v-toolbar-title>
          </v-toolbar>
          <br><br><br><br>
          <v-card-actions>
            <v-btn
              color="primary"
              to="/login"
              v-if="!user"
            >Login</v-btn>
            <v-btn
              color="primary"
              to="/register"
              v-if="!user"
            >Register</v-btn>
            <v-btn
              color="primary"
              to="/restaurants"
              v-if="user"
            >View restaurants</v-btn>
          </v-card-actions>
          <br>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'error',
    computed: {
      ...mapGetters({
        user: 'users/getUser'
      })
    }
  }
</script>
