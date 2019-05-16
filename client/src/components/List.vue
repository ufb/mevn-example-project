<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 md8>
        <v-card class="elevation-0">
          <v-toolbar dark color="primary" class="elevation-0 py-2">
            <v-layout wrap align-center>
              <slot name="toolbar-primary"></slot>
            </v-layout>
          </v-toolbar>
          <v-toolbar v-if="tb2" dark color="card" class="elevation-1 py-2">
            <v-layout>
              <slot name="toolbar-secondary"></slot>
            </v-layout>
          </v-toolbar>
          <slot name="list"></slot>
          <v-toolbar v-if="tb3" dark color="card" class="elevation-0 pt-4 pb-2">
            <v-layout align-center>
              <slot name="toolbar-tertiary"></slot>
            </v-layout>
          </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'list',
    props: {
      tb2: { type: Boolean },
      tb3: { type: Boolean }
    }
  }
</script>
