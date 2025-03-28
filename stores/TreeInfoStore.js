import { useCookie } from "#app";

export const TreeInfoStore = defineStore("treeInfo", {
  state: () => ({
    treeInfos: [],
  }),
  actions: {
    async getTreeInfos() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/treeinfo/get`,
          {
            method: "GET",
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.treeInfos = data.value?.treeInfos;
        } else {
          alert("Có lỗi trong lúc lấy TreeInfos. Thử lại sau");
          UserStore().signOut();
        }
      } catch (err) {
        console.error("Fetch TreeInfos thất bại:", err);
        alert("Có lỗi trong lúc lấy TreeInfos. Thử lại sau");
        UserStore().signOut();
      }
    },
    async addTreeInfo(treeInfo, file) {
      try {
        treeInfo.role[UserStore().email] = "owner";
        let uploadedImageUrl = null;
        if (file) {
          uploadedImageUrl = await uploadImage(file);
        }

        treeInfo.image = uploadedImageUrl || "";
        const { fetchApi } = useApi();
        const data = await fetchApi(
          `/api/treeinfo/add`,
          {
            method: "POST",
            body: JSON.stringify(treeInfo),
          }
        );

        if (data.success) {
          alert("Family tree added successfully!");
        } else {
          alert("Failed to add family tree");
        }
      } catch (error) {
        alert("Error adding family tree: " + error.message);
      }
    },
  },
  persist: true,
});
