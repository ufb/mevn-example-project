<template>
  <v-btn
    color="primary"
    @click="submit"
  ><span :class="{'d-none': $vuetify.breakpoint.xs }">Logout&nbsp;&nbsp;&nbsp;</span><v-icon>exit_to_app</v-icon></v-btn>
</template>

<script>
  export default {
    name: 'logout',
    methods: {
      submit() {
        this.$store.dispatch('users/logout');
        this.$router.replace(this.$route.query.redirect || '/login');
      }
    }
  }
</script>
