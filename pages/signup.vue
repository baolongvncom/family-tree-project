<template>
  <v-app>
    <v-row style="background: linear-gradient(to right, #1e90ff, #32cd32)">
      <v-col cols="6">
        <v-container class="fill-height d-flex align-center justify-end">
          <v-card rounded="xl" width="50%" class="elevation-12 mr-16">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Sign Up Form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <form ref="form" @submit.prevent="signup()">
                <v-text-field
                  v-model="username"
                  name="password"
                  label="Nickname"
                  type="text"
                  placeholder="Nickname"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  required
                ></v-text-field>
                <v-layout class="d-flex flex-column align-center ga-2">
                  <v-btn
                    type="submit"
                    class="mt-4"
                    color="primary"
                    value="log in"
                    :disabled="isDisabledButton"
                    >Sign Up</v-btn
                  >
                  <NuxtLink
                    to="/signin"
                    class="text-primary text-decoration-underline"
                  >
                    Already have an Account? Sign In
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
  name: "Signup",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      userStore: UserStore(),
    };
  },
  computed: {
    isDisabledButton() {
      return (
        this.username.trim() === "" ||
        !this.email.includes("@") ||
        this.password.length < 6 ||
        this.password.length > 9
      );
    },
  },
  methods: {
    async signup() {
      await this.userStore.signUp(this.username, this.email, this.password);
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
