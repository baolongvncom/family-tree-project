export const FamilyStore = defineStore("family", {
  state: () => ({
    tree_id: "",
    family: [],
    permission: "",
    family_name: "",
    code: "",
  }),
  actions: {
    async getFamily(tree_id) {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/family/get`, {
          method: "POST",
          body: JSON.stringify({ tree_id: tree_id }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.permission = data.value?.permission;
          this.family = data.value?.family;
          this.tree_id = tree_id;
          this.family_name = data.value?.family_name;
          this.code = data.value?.code;
        } else {
          alert("Có lỗi trong lúc lấy Family Member. Thử lại sau");
          navigateTo("/");
        }
      } catch (err) {
        console.error("Fetch Family Member thất bại:", err);
        alert("Có lỗi trong lúc lấy Family Member. Thử lại sau");
        navigateTo("/");
      }
    },
    async addMember(member, file) {
      try {
        let uploadedImageUrl = null;
        if (file) {
          uploadedImageUrl = await uploadImage(file);
        }

        member.image = uploadedImageUrl || "";

        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/family/add`, {
          method: "POST",
          body: JSON.stringify(member),
        });

        if (data.success) {
          alert("Family Member added successfully!");
        } else {
          alert("Failed to add family member");
        }
      } catch (error) {
        alert("Error adding family member: " + error.message);
      }
    },
    async updateMember(member_id, member, file) {
      try {
        let uploadedImageUrl = null;
        if (file) {
          uploadedImageUrl = await uploadImage(file);
        }

        member.image = uploadedImageUrl || "";

        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/member/update`, {
          method: "POST",
          body: JSON.stringify({member_id, member}),
        });

        if (data.success) {
          alert("Family Member updated successfully!");
        } else {
          alert("Failed to update family member");
        }
      } catch (error) {
        alert("Error updating family member: " + error.message);
      }
    },
    async getPermissions(tree_id) {
      try {
        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/treeinfo/getpermissions`, {
          method: "POST",
          body: JSON.stringify({ tree_id }),
        });

        if (data.success) {
          return {permissions: data.permissions, permissionData: data.permissionData};
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Fetch Family Permissions thất bại:", err);
        navigateTo(`/family/${this.tree_id}`);
      }
    },
    async updatePermission(tree_id, user_email, new_permission) {
      try {
        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/treeinfo/updatepermission`, {
          method: "POST",
          body: JSON.stringify({ tree_id, user_email, new_permission }),
        });

        if (data.success) {
          if (new_permission === "owner") navigateTo(`/family/${this.tree_id}`);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Update Family Permissions thất bại:", err);
        navigateTo(`/family/${this.tree_id}`);
      }
    },
    async deletePermission(tree_id, user_email) {
      try {
        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/treeinfo/deletepermission`, {
          method: "POST",
          body: JSON.stringify({ tree_id, user_email }),
        });

        if (data.success) {
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Delete Family Permissions thất bại:", err);
        navigateTo(`/family/${this.tree_id}`);
      }
    },
    async deleteFamilyTree(tree_id) {
      try {
        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/treeinfo/delete`, {
          method: "POST",
          body: JSON.stringify({ tree_id }),
        });

        if (data.success) {
          navigateTo(`/`);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Delete Family Tree thất bại:", err);
        navigateTo(`/family/${tree_id}`);
      }
    },
  },
  persist: true,
});
