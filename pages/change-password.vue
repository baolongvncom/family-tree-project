<template>
  <v-app>
    <v-row style="background: linear-gradient(to right, #1e90ff, #32cd32)">
      <v-col cols="6">
        <v-container class="fill-height d-flex align-center justify-end">
          <v-card rounded="xl" width="50%" class="elevation-12 mr-16">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Change password Form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <form ref="form" @submit.prevent="changePassword()">
                <v-text-field
                  class="mb-2"
                  v-model="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  :hide-details="isDisabledEmailButton"
                  messages="Invalid Email Format"
                  required
                ></v-text-field>
                <v-text-field
                  class="mb-2"
                  v-model="old_password"
                  name="password"
                  label="Enter Old Password"
                  type="password"
                  placeholder="Enter Old Password"
                  :hide-details="!isDisabledPasswordButton(old_password)"
                  messages="Password must contain at least 6 characters and at most 9 characters!"
                  required
                ></v-text-field>
                <v-text-field
                  class="mb-2"
                  v-model="new_password"
                  name="password"
                  label="Enter New Password"
                  type="password"
                  placeholder="Enter New Password"
                  :hide-details="!isDisabledPasswordButton(new_password)"
                  messages="Password must contain at least 6 characters and at most 9 characters!"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="new_password == ''"
                  class="mb-2"
                  v-model="new_password_duplica"
                  name="password"
                  label="Re-Enter New Password"
                  type="password"
                  placeholder="Re-Enter New Password"
                  :hide-details="checkPasswordDuplica"
                  messages="Passwords do not match!"
                  required
                ></v-text-field>
                <v-layout class="d-flex flex-column align-center ga-2">
                  <v-btn
                    type="submit"
                    class="mt-4"
                    color="primary"
                    value="log in"
                    :disabled="isDisabledButton"
                    >Update Password</v-btn
                  >
                  <NuxtLink
                    to="/signin"
                    class="text-primary text-decoration-underline"
                  >
                    Go To Sign In Page
                  </NuxtLink>
                </v-layout>
              </form>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
      <v-col cols="6">
        <v-container class="fill-height hero"></v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "ChangePassword",
  data() {
    return {
      email: "",
      old_password: "",
      new_password: "",
      new_password_duplica: "",
      userStore: UserStore(),
    };
  },
  computed: {
    isDisabledButton() {
      return (
        !this.email.includes("@") ||
        this.old_password.length < 6 ||
        this.old_password.length > 9 ||
        this.new_password.length < 6 ||
        this.new_password.length > 9 ||
        this.new_password_duplica.length < 6 ||
        this.new_password_duplica.length > 9
      );
    },
    isDisabledEmailButton() {
      return !this.email.includes("@");
    },
    checkPasswordDuplica() {
      return this.new_password == this.new_password_duplica;
    },
  },
  methods: {
    async changePassword() {
      await this.userStore.changePassword(this.email, this.old_password, this.new_password);
    },
    isDisabledPasswordButton(password) {
      return password.length < 6 || password.length > 9;
    },
  },
};
</script>

<style scoped>
.hero {
  background: url("/public/family-tree.png");
  background-size: cover;
  width: 100vh;
}
</style>
