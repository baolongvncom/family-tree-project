<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex flex-column fill-height align-center justify-center"
  >
    <v-card class="d-flex flex-column align-center justify-center">
      <v-text-field
        :model-value="UserStore().username"
        class="mb-2"
        width="250"
        prefix="Username:"
        variant="solo"
        flat
        hide-details
        readonly
      ></v-text-field>
      <v-text-field
        :model-value="UserStore().email"
        class="mb-2"
        prefix="Email:"
        variant="solo"
        width="250"
        flat
        hide-details
        readonly
      ></v-text-field>
      <v-btn color="primary" to="/change-password">
        Go To Change Password Page
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Account",
  data() {
    return {};
  },
  setup() {
    definePageMeta({
      layout: "home",
    });
  },
};
</script>
