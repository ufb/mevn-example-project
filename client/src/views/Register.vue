<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md5>
        <v-card>
          <v-toolbar dark color="primary" class="elevation-1 py-2">
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-text-field
                prepend-icon="person"
                name="email"
                label="Email"
                type="email"
                v-model.trim="email"
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
                v-model.trim="password"
                :rules="passwordRules"
                :counter="64"
                required
                validate-on-blur
                 @keyup.enter="submit"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password2"
                label="Repeat Password"
                type="password"
                v-model.trim="password2"
                :rules="password2Rules"
                :counter="64"
                required
                validate-on-blur
                 @keyup.enter="submit"
              ></v-text-field>
              <v-checkbox
                :label="'I am a restaurant owner'"
                v-model.trim="owner"
              ></v-checkbox>
            </v-card-text>
            <v-card-actions class="px-3">
              <span class="accent--text">Already have an account?</span> <router-link to="/login" class="pl-2 white--text">Login</router-link>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click.prevent="submit"
              >Register</v-btn>
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
  import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators';
  import { mapGetters } from 'vuex';
  import messengerService from '../services/messenger.service';

  export default {
    name: 'register',

    mixins: [validationMixin],

    validations: {
      email: { required, email },
      password: { required, minLength: minLength(8), maxLength: maxLength(64) },
      password2: { sameAsPassword: sameAs('password') }
    },

    data() {
      return {
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
        }],
        password2Rules: [() => {
          if (this.$v.password2.sameAsPassword || !this.$v.password2.$invalid) return true;
          return 'Passwords don\'t match!';
        }],
        email: '',
        password: '',
        password2: '',
        owner: false
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
          this.$store.dispatch('users/register', {
            email: this.email,
            password: this.password,
            owner: this.owner
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
