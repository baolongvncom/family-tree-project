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
          alert("Đăng ký thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.");
        }
      } catch (err) {
        console.error("Đăng ký thất bại:", err);
        alert("Đăng ký thất bại! Vui lòng thử lại.");
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
          alert(
            "Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu."
          );
        }
      } catch (err) {
        console.error("Đăng nhập thất bại:", err);
        alert("Đăng nhập thất bại! Vui lòng thử lại.");
      }
    },
  },
});
