<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md5>
        <v-card>
          <v-toolbar dark color="primary" class="elevation-1 py-2">
            <v-toolbar-title>Login Form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-text-field
                prepend-icon="person"
                name="email"
                label="Email"
                type="email"
                v-model="email"
                :rules="emailRules"
                required
                validate-on-blur
                 @keyup.enter="submit"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
                :rules="passwordRules"
                :counter="64"
                required
                validate-on-blur
                 @keyup.enter="submit"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="px-3">
              <span class="accent--text">Not have an account yet?</span> <router-link to="/register" class="pl-2 white--text">Register</router-link>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click.prevent="submit"
              >Login</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  //import { VCard, VTextField } from 'vuetify/lib';
  import { validationMixin } from 'vuelidate';
  import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
  import { mapGetters } from 'vuex';
  import messengerService from '../services/messenger.service';

  export default {
    name: 'login',

    mixins: [validationMixin],

    validations: {
      email: { required, email },
      password: { required, minLength: minLength(8), maxLength: maxLength(64) }
    },

    data() {
      return {
        email: '',
        password: '',
        emailRules: [() => {
          let msg = '';
          if (!this.$v.email.required) msg += 'E-mail is required. ';
          if (!this.$v.email.email) msg += 'Must be valid e-mail.';
          return msg || true;
        }],
        passwordRules: [() => {
          let msg = '';
          if (!this.$v.password.required) msg += 'Password is required. ';
          if (!this.$v.password.minLength || !this.$v.password.maxLength) msg += 'Password must contain 8 to 64 characters.';
          return msg || true;
        }]
      }
    },

    computed: {
      ...mapGetters({
        user: 'users/getUser'
      })
    },

    methods: {
      submit() {
        this.$refs.form.validate();

        if (!this.$v.$invalid) {
          return this.$store.dispatch('users/login', {
            username: this.email,
            password: this.password
          })
            .then(() => {
              if (this.user) {
                const query = this.user.role === 'owner' ? '?own=true' : '';
                this.$router.push(`/restaurants${query}`);
              }
            });
        }
      }
    },

    created() {
      if (this.user) {
        messengerService('You are already logged in.', 'info');
        //this.$router.push('/restaurants');
      }
    }
  }
</script>
