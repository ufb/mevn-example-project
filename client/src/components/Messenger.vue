<template>

  <v-snackbar
     multi-line
     :value="!!message"
     :class="message.type + '--text'"
     v-if="message"
     :timeout="0"
     top
     vertical
     auto-height
   >
     <span class="pr-4">{{ message.message }}</span>
     <v-btn
       :color="message ? message.type : 'error'"
       class="mt-2"
       flat
       @click="message = null"
     >
       &#10005;
     </v-btn>
   </v-snackbar>
</template>

<script>
  import Bus from '../services/event.service';

  export default {
    name: 'messenger',
    data() {
      return {
        message: null
      }
    },
    computed: {
      timeout() { return 5000 }
    },
    mounted() {
      Bus.$on('message', msg => this.message = msg);
    }
  }
</script>
