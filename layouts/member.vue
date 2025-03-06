<template>
  <v-app id="inspire">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Family Tree</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn :to="`/family/${MemberStore().tree_id}`" variant="outlined"> Quay về Member Dashboard </v-btn>
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
          :to="`/member/${$route.params.id}`"
        ></v-list-item>
        <!-- <v-list-item
          prepend-icon="mdi-account-box"
          title="Tạo Member"
          :to="`/member/add-${$route.params.id}`"
        ></v-list-item> -->
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="handleSignOut"> Đăng xuất </v-btn>
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
      drawer: null,
    };
  },
  computed: {
    memberStore() {
      return MemberStore();
    },
  },
  methods: {
    handleSignOut() {
      this.userStore.signOut();
    },
  },
};
</script>
