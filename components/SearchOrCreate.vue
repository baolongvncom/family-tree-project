<template>
  <v-card max-width="344" class="d-flex flex-column align-center" :to="to">
    <v-icon size="344" style="background-color: cyan">
      {{ icon }}
    </v-icon>

    <v-card-title>
      {{ message }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "SearchOrCreateTree",
  data: () => ({
    show: false,
  }),
  props: {
    message: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: "",
    },
  },
};
</script>
