<template>
  <v-card class="mx-auto" max-width="344" width="fit-content">
    <v-img
      height="200px"
      :src="image ? image : 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
      cover
    ></v-img>

    <v-card-title> {{ name }} </v-card-title>

    <v-card-subtitle> {{ date }} </v-card-subtitle>

    <v-card-actions>
      <v-btn :to="url" color="orange-lighten-2" text="Explore"></v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-if="description"
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <v-expand-transition v-if="description">
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ description }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    show: false,
  }),
  props: {
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: "",
    },
  },
};
</script>
