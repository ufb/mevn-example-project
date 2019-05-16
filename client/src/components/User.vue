<template>
  <v-list-tile class="py-2 px-0 mx-4">
    <v-layout wrap>
      <v-flex xs12 v-if="edit">
        <v-form ref="form">
          <v-text-field
            :placeholder="user.email"
            name="email"
            :rules="emailRules"
            type="email"
            v-model.trim="email"
            validate-on-blur
          ></v-text-field>
          <v-text-field
            :placeholder="user.password"
            name="password"
            :rules="passwordRules"
            :counter="64"
            type="password"
            v-model.trim="password"
            validate-on-blur
          ></v-text-field>
          <v-select
            :placeholder="user.role"
            :items="roles"
            v-model="role"
          ></v-select>
          <v-btn
            color="secondary"
            @click="submitEdit"
            class="left"
          >Submit</v-btn>
          <v-btn
            color="tertiary"
            @click="edit = false; email = ''; password = ''; role = ''"
          >Cancel</v-btn>
          <v-btn
            color="tertiary"
            @click="email = ''; password = ''; role = ''"
            class="left"
          >Clear</v-btn>
        </v-form>
      </v-flex>
      <template v-else>
        <v-flex xs8>
          <v-list-tile-content>
            <v-list-tile-title>
              E-mail: {{ user.email }}
              <span v-if="isSelf" class="title ml-5 info--text">(me)</span>
            </v-list-tile-title>
            <v-list-tile-sub-title>Password: {{ user.password }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="accent--text">Role: {{ user.role }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-flex>
        <v-flex xs3 offset-xs1>
          <v-dialog
            v-model="dialog"
            width="280"
            class="right"
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
                <span v-if="isSelf">
                  Are you sure you want to remove <span class="error--text">yourself</span> from the database?
                </span>
                <span v-else>
                  Remove user {{ user.email }} from database?
                </span>
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
          <v-tooltip top color="dark" lazy>
            <v-btn
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
            <span>Edit this user</span>
          </v-tooltip>
        </v-flex>
      </template>
    </v-layout>
  </v-list-tile>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { minLength, maxLength, email } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  name: 'restaurant-list',

  mixins: [validationMixin],

  validations: {
    email: { email },
    password: { minLength: minLength(8), maxLength: maxLength(64) }
  },

  data() {
    return {
      emailRules: [() => {
        if (!this.$v.email.email) return 'Must be valid e-mail.';
        return true;
      }],
      passwordRules: [() => {
        if (!this.$v.password.minLength || !this.$v.password.maxLength) return 'Password must contain 8 to 64 characters.';
        return true;
      }],
      dialog: false,
      edit: false,
      email: '',
      password: '',
      role: '',
      roles: [{ value: '', disabled: true, text: 'Role' }, 'admin', 'owner', 'user']
    };
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'users/getUser'
    }),
    isSelf() {
      if (this.currentUser) return this.currentUser._id === this.user._id;
      return false
    }
  },
  methods: {
    submitDelete() {
      this.$store.dispatch('users/removeUser', this.user._id)
        .then(() => !this.isSelf || this.logout());
    },
    submitEdit() {
      if (!this.$v.$invalid) {

        const user = this.user;

        this.$store.dispatch('users/updateUser', {
          _id: user._id,
          email: this.email || user.email,
          password: this.password || user.password,
          role: this.role || user.role
        })
        .then(() => {
          this.edit = false;
          this.$store.dispatch('users/fetchUsers')
            .then(() => !this.isSelf || this.logout());
        });
      }
    },
    logout() {
      this.$store.dispatch('users/logout');
      this.$router.replace(this.$route.query.redirect || '/login');
    }
  }
}
</script>
