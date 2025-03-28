<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex fill-height align-center justify-center"
  >
    <v-data-table
      :headers="headers"
      :items="permissions_formData"
      :loading="loadingTable"
      :disabled="disabledTable"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-pine-tree"
              size="x-small"
              start
            ></v-icon>
            {{ FamilyStore().family_name }}
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.new_role="{ item }">
        <div class="d-flex justify-center">
          <v-select
            :disabled="
              item.role === 'owner' && item.email === UserStore().email
            "
            v-model="item.new_role"
            :items="roles"
          >
          </v-select>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-btn
            :disabled="
              (item.role === 'owner' && item.email === UserStore().email) ||
              item.role === item.new_role
            "
            color="primary"
            @click="checkUpdatePermission(item.email, item.new_role)"
            >Update</v-btn
          >

          <v-btn
            :disabled="
              item.role === 'owner' && item.email === UserStore().email
            "
            color="red"
            @click="deletePermission(item.email)"
            >Delete</v-btn
          >
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="askToChangeOwner" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="You will be no longer the owner of this Family Tree !"
        title="Are you sure ?"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="
              askToChangeOwner = false;
              updatePermission(new_owner.user_email, new_owner.new_permission);
            "
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "FamilyPermissions",
  setup() {
    definePageMeta({
      layout: "family",
    });
  },
  data() {
    return {
      new_owner: { user_email: "", new_permission: "" },
      tree_id: this.$route.params.id,
      askToChangeOwner: false,
      loadingTable: false,
      disabledTable: false,
      roles: ["owner", "editor", "viewer", "pending"],
      headers: [
        { title: "Email", key: "email" },
        { title: "Username", key: "username" },
        { title: "Role", key: "new_role", align: "center" },
        { title: "Actions", key: "actions", align: "end", sortable: false },
      ],
      permissions: [],
      permissions_formData: [],
    };
  },
  methods: {
    async updatePermission(user_email, new_permission) {
      this.loading = true;
      this.disabledTable = true;
      await FamilyStore().updatePermission(
        this.tree_id,
        user_email,
        new_permission
      );
      this.permissions = await FamilyStore().getPermissions(
        this.$route.params.id
      );
      this.new_owner.new_permission = "";
      this.new_owner.user_email = "";
      this.loading = false;
      this.disabledTable = false;
    },
    async deletePermission(user_email) {
      this.loading = true;
      this.disabledTable = true;
      await FamilyStore().deletePermission(this.tree_id, user_email);
      this.permissions = await FamilyStore().getPermissions(
        this.$route.params.id
      );
      this.new_owner.new_permission = "";
      this.new_owner.user_email = "";
      this.loading = false;
      this.disabledTable = false;
    },
    async checkUpdatePermission(user_email, new_permission) {
      if (new_permission === "owner") {
        this.new_owner.user_email = user_email;
        this.new_owner.new_permission = new_permission;
        this.askToChangeOwner = true;
        return;
      }
      await this.updatePermission(user_email, new_permission);
    },
  },
  watch: {
    permissions: {
      handler(newPermissions) {
        this.permissions_formData = newPermissions.map((permission) => ({
          ...permission,
          new_role: permission.role,
        }));
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    this.permissions = await FamilyStore().getPermissions(
      this.$route.params.id
    );
  },
};
</script>
