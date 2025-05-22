<template>
  <v-app id="inspire">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ FamilyStore().family_name }}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn to="/" variant="outlined"> Return to Family Dashboard </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      width="320"
      v-model="drawer"
      class="bg-deep-purple"
      theme="dark"
      temporary
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="My Family Members"
          :to="`/family/${$route.params.id}`"
        ></v-list-item>
        <v-list-item
          :disabled="
            FamilyStore().permission !== 'owner' &&
            FamilyStore().permission !== 'editor'
          "
          prepend-icon="mdi-account-box"
          title="Create New Member"
          :to="`/family/add-${$route.params.id}`"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-file-chart-outline"
          title="Member Report"
          :to="`/family/member-report-${$route.params.id}`"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-trophy-variant-outline"
          title="Achievement Report"
          :to="`/family/achievement-report-${$route.params.id}`"
        ></v-list-item>
        <v-list-item
          :disabled="FamilyStore().permission !== 'owner'"
          prepend-icon="mdi-account-box"
          title="Family Tree Management"
          :to="`/family/permissions-${$route.params.id}`"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="handleSignOut"> Sign Out </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      tree_id: this.$route.params.id,
      drawer: null,
    };
  },
  computed: {
    userStore() {
      return UserStore();
    },
  },
  methods: {
    handleSignOut() {
      this.userStore.signOut();
    },
  },
  async created() {
    await FamilyStore().getFamily(this.tree_id);
  },
};
</script>
