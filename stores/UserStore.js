import { useCookie } from "#app";

export const UserStore = defineStore("user", {
  state: () => ({
    username: "",
    email: "",
    authenticated: false,
  }),
  actions: {
    async signUp(username, email, password) {
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/signup`,
          {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.username = username;
          this.email = email;
          this.authenticated = true;

          // Lưu token vào cookie
          const authToken = useCookie("auth-token", {
            maxAge: 60 * 60 * 24 * 7,
          }); // 7 ngày
          authToken.value = data.value.token;

          // Chuyển hướng tới trang chủ
          return navigateTo("/");
        } else {
          alert("Fail to Sign up! Please check your email or password again.");
        }
      } catch (err) {
        console.error("Fail to Sign up:", err);
        alert("Fail to Sign up! Try again.");
      }
    },
    async changePassword(email, old_password, new_password) {
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/change-password`,
          {
            method: "POST",
            body: JSON.stringify({ email, old_password, new_password }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          alert("Change Password Successfully!");
          return navigateTo("/signin");
        } else {
          alert("Change Password Unsuccessfully");
        }
      } catch (err) {
        console.error("Change Password Unsuccessfully:", err);
        alert("Error While Changing Password.");
      }
    },
    signOut() {
      // Xóa cookie token
      const authToken = useCookie("auth-token");
      authToken.value = null;

      // Xóa trạng thái người dùng
      this.username = "";
      this.email = "";
      this.authenticated = false;

      // Chuyển hướng về trang đăng nhập
      navigateTo("/signin");
    },

    async signIn(email, password) {
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/signin`,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.name = data.value.name; // Lấy tên từ API nếu có
          this.email = email;
          this.authenticated = true;

          // Lưu token vào cookie
          const authToken = useCookie("auth-token", {
            maxAge: 60 * 60 * 24 * 7,
          }); // 7 ngày
          authToken.value = data.value.token;

          // Chuyển hướng tới trang chủ
          return navigateTo("/");
        } else {
          alert("Fail to Sign in! Please check your email or password again.");
        }
      } catch (err) {
        console.error("Fail to Sign in:", err);
        alert("Fail to Sign in! Try Again.");
      }
    },
  },
});
