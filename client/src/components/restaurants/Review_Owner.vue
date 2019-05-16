<template>
  <v-list-tile class="py-2 px-0 mx-4 mb-2">
    <v-layout wrap algin-top>
      <v-flex xs12 md6>
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
      <v-flex xs12 md5 offset-md1>
        <v-list-tile-action>
          <v-card-actions>
            <v-form ref="form" v-if="showReplyField">
              <v-textarea
                :name="`reply-${review._id}`"
                :rules="replyRules"
                :counter="500"
                v-model="reply"
                @keyup.enter="submitReply(review._id)"
                validate-on-blur
                label="Reply"
                box
                autofocus
                required
              ></v-textarea>
              <v-btn
                color="secondary"
                class="px-2"
                @click="submitReply(review._id)"
              >Submit</v-btn>
              <v-btn
                color="tertiary"
                class="px-2"
                @click="showReplyField = false; reply = ''"
              >Cancel</v-btn>
              <v-btn
                color="tertiary"
                class="px-2"
                @click="reply = ''"
              >Clear</v-btn>
            </v-form>
            <v-btn
              v-if="review.comment && !showReplyField"
              color="secondary"
              class="px-2"
              @click="showReplyField = true"
            >Reply</v-btn>
          </v-card-actions>
        </v-list-tile-action>
      </v-flex>
    </v-layout>
  </v-list-tile>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'review-owner',

  mixins: [validationMixin],

  validations: {
    reply: { required, minLength: minLength(1), maxLength: maxLength(500) }
  },

  data() {
    return {
      replyRules: [() => {
        let msg = '';
        if (!this.$v.reply.required) msg += 'Please leave a reply. ';
        if(!this.$v.reply.minLength || !this.$v.reply.maxLength) msg += 'Reply must contain between 1 and 500 characters!';
        return msg || true;
      }],
      showReplyField: false,
      reply: ''
    };
  },
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  computed: {
    date() {
      const date = new Date(this.review.created);
      return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    }
  },
  methods: {
    submitReply() {
      this.$refs.form.validate();

      if (!this.$v.$invalid) {
        this.$store.dispatch('restaurants/sendReply', {
          reply: this.reply,
          sid: this.review.restaurant.toString(),
          vid: this.review._id.toString()
        });
      }
    }
  }
}
</script>
