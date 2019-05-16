<template>
  <v-list-tile class="py-2 px-0 mx-4 mb-2">
    <v-layout wrap algin-top>
      <v-flex xs12 v-if="edit">
        <v-form ref="form" class="pt-4">
          <v-layout wrap align-end>
            <v-flex xs12 md4>
              <v-rating
                color="accent"
                :value="rating"
                name="rating"
                v-model="rating"
              ></v-rating><br>
            </v-flex>
            <v-flex xs12 md4 offset-md1>
              <v-text-field
                prepend-icon="date_range"
                placeholder="YYYY-MM-DD hh:mm:ss"
                name="created"
                v-model="created"
                :rules="dateRules"
                validate-on-blur
                required
              ></v-text-field>
              <br>
            </v-flex>
            <v-flex xs12 md4>
              <v-textarea
                name="comment"
                :rules="commentRules"
                :counter="500"
                v-model="comment"
                validate-on-blur
                label="Comment"
                :placeholder="review.comment"
                box
                autofocus
                required
              ></v-textarea>
              <v-btn
                color="tertiary"
                class="px-2"
                @click="edit = false; clear()"
              >Cancel</v-btn>
              <v-btn
                color="tertiary"
                class="px-2"
                @click="comment = ''"
              >Clear</v-btn>
            </v-flex>
            <v-flex xs12 md4 offset-md1>
              <v-textarea
                name="reply"
                :rules="replyRules"
                :counter="500"
                v-model="reply"
                validate-on-blur
                label="Reply"
                :placeholder="review.reply"
                box
                required
              ></v-textarea>
              <v-btn
                color="tertiary"
                class="px-2"
                @click="edit = false; clear()"
              >Cancel</v-btn>
              <v-btn
                color="tertiary"
                class="px-2"
                @click="reply = ''"
              >Clear</v-btn>
            </v-flex>
            <v-flex xs12 md2 offset-md1>
              <v-btn
                color="secondary"
                class="right"
                @click="submitReview"
              >Submit</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
      <template v-else>
        <v-flex xs12 sm6>
          <div class="right mt-4">
            <span class="grey--text mr-2 caption">Comment</span>
            <v-icon class="comment-icon accent--text">chat_bubble_outline</v-icon>
          </div>
          <div class="pr-4">
            <div class="date">{{ date }}</div>
            <v-rating
              v-if="review.rating"
              half-increments
              color="accent"
              small
              :value="review.rating || 0"
              readonly
            ></v-rating>
            <div v-if="review.comment" class="comment accent--text left mt-1">{{ review.comment }}</div>
          </div>
        </v-flex>
        <v-flex xs12 sm5 offset-sm1 v-if="user && user.role === 'admin'">
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
              class="right mx-0"
            ><v-icon>close</v-icon></v-btn>
            <v-card>
              <v-card-text>
                Remove this review from database?
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
          <v-btn
            v-if="!edit"
            color="secondary"
            fab
            small
            depressed
            right
            class="right mr-0"
            @click="edit = true"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs9 sm6>
          <div v-if="review.reply">
            <div class="left mt-2" :class="{ 'mt-5': user && user.role !== 'admin' }">
              <v-icon class="reply-icon info--text">chat_bubble_outline</v-icon>
              <span class="grey--text ml-2 caption">Reply from restaurant owner</span>
            </div>
            <div class="pl-4" :class="{ 'pt-5': user && user.role !== 'admin' }">
              <div class="reply info--text right mt-1">{{ review.reply }}</div>
            </div>
          </div>
        </v-flex>
      </template>
    </v-layout>
  </v-list-tile>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { minLength, maxLength } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  name: 'review',

  mixins: [validationMixin],

  validations: {
    comment: { minLength: minLength(1), maxLength: maxLength(500) },
    reply: { minLength: minLength(1), maxLength: maxLength(500) },
    rating: {},
    created: {}
  },

  data() {
    return {
      commentRules: [() => {
        if(!this.$v.comment.minLength || !this.$v.comment.maxLength) return 'Comment must contain between 1 and 500 characters!';
        return true;
      }],
      replyRules: [() => {
        if(!this.$v.reply.minLength || !this.$v.reply.maxLength) return 'Reply must contain between 1 and 500 characters!';
        return true;
      }],
      dateRules: [() => {
        let created = this.created;

        if (created) {
          created = new Date(created);
          if (typeof created !== 'object' || created.toString() === 'Invalid Date') {
            return 'Must be valid date format - i.e. YY/MM/DD';
          }
        }
        return true;
      }],
      edit: false,
      dialog: false,
      comment: '',
      reply: '',
      rating: 0,
      created: '',
      validated: false
    };
  },
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/getUser'
    }),
    date() {
      const date = new Date(this.review.created);
      return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    }
  },
  methods: {
    clear() {
      this.rating = 0;
      this.created = '';
      this.reply = '';
      this.comment = '';
    },
    submitDelete() {
      this.$store.dispatch('restaurants/removeReview', {
        sid: this.review.restaurant.toString(),
        vid: this.review._id.toString()
      });
    },
    submitReview() {
      this.$refs.form.validate();
      this.validated = true;

      if (!this.$v.$invalid) {
        const review = this.review;

        this.$store.dispatch('restaurants/updateReview', {
          review: {
            reply: this.reply || review.reply,
            comment: this.comment || review.comment,
            created: this.created || review.created,
            rating: this.rating || review.rating,
            _id: this.review._id
          },
          sid: review.restaurant.toString()
        })
          .then(() => {
            this.clear();
            this.edit = false;
          });
      }
    }
  }
}
</script>
