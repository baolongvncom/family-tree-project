<template>
  <v-container fluid class="d-flex fill-height align-center justify-center ga-16">
    <search-or-create message="Create New Family Tree" icon="mdi-plus" to="/tree/create"></search-or-create>
    <search-or-create message="Search Family Tree" icon="mdi-magnify" to="/tree/search"></search-or-create>
  </v-container>
</template>

<script>
export default {
  name: "SearchOrCreate",
  setup() {
    definePageMeta({
      layout: "home",
    });
  },
};
</script>
