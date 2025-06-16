<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex flex-column fill-height align-center justify-center"
  >
    <v-card class="d-flex flex-column align-center justify-center">
      <v-text-field
        v-model="username"
        class="mb-2"
        width="250"
        prefix="Username:"
        variant="solo"
        flat
        hide-details
        :readonly="!isEditing"
      >
        <template v-slot:append>
          <v-slide-x-reverse-transition mode="out-in">
            <v-icon
              :key="`icon-${isEditing}`"
              :color="isEditing ? 'success' : 'info'"
              :icon="
                isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'
              "
              @click="updateUsername"
            ></v-icon>
          </v-slide-x-reverse-transition>
        </template>
      </v-text-field>
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
    return {
      isEditing: false,
      username: "",
    };
  },
  setup() {
    definePageMeta({
      layout: "home",
    });
  },
  created() {
    watch(
      () => UserStore().username,
      (newVal) => {
        this.username = newVal;
      },
      { immediate: true } 
    );
  },
  methods: {
    async updateUsername() {
      if (this.isEditing) {
        await UserStore().updateUsername(this.username);
      }
      this.isEditing = !this.isEditing;
    },
  },
};
</script>
