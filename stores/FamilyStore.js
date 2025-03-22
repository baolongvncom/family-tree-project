import { useCookie } from "#app";
import { da } from "vuetify/locale";

export const FamilyStore = defineStore("family", {
  state: () => ({
    tree_id: "",
    family: [],
    permission: "",
  }),
  actions: {
    async getFamily(tree_id) {
      try {
        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/family/get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken.value,
            },
            body: JSON.stringify({tree_id: tree_id}),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.family = data.value?.family;
          this.tree_id = tree_id;
        } else {
          alert("Có lỗi trong lúc lấy Family Member. Thử lại sau");
          navigateTo('/');
        }
      } catch (err) {
        console.error("Fetch Family Member thất bại:", err);
        alert("Có lỗi trong lúc lấy Family Member. Thử lại sau");
        navigateTo('/');
      }
    },
    async addMember(member, file) {
      try {
        let uploadedImageUrl = null;
        if (file) {
          uploadedImageUrl = await uploadImage(file);
        }

        member.image = uploadedImageUrl || "";

        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const response = await fetch(
          `${config.public.apiBase}/api/family/add`,
          {
            method: "POST",
            body: JSON.stringify(member),
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken.value,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          alert("Family Member added successfully!");
        } else {
          alert("Failed to add family member");
        }
      } catch (error) {
        alert("Error adding family member: " + error.message);
      }
    },
  },
  persist: true,
});
