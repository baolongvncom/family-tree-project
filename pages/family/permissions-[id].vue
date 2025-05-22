<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex flex-column fill-height align-center justify-center"
  >
    <v-card-title
      >Share your Family Tree Code to others for searching for your Family
      Tree:</v-card-title
    >
    <div style="font: bold; color: green">{{ FamilyStore().code }}</div>
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
          <v-autocomplete
            :disabled="
              item.role_name === 'owner' && item.email === UserStore().email
            "
            v-model="item.new_role"
            :items="permissionData"
            item-title="name"
            item-value="_id"
          >
          </v-autocomplete>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-btn
            :disabled="
              (item.role_name === 'owner' && item.email === UserStore().email) ||
              item.role === item.new_role
            "
            color="primary"
            @click="
              checkUpdatePermission(item.email, item.new_role, item.role_name)
            "
            >Update</v-btn
          >

          <v-btn
            :disabled="
              item.role_name === 'owner' && item.email === UserStore().email
            "
            color="red"
            @click="deletePermission(item.email)"
            >Delete</v-btn
          >
        </div>
      </template>
    </v-data-table>
    <v-btn
      class="mt-5"
      :disabled="!FamilyStore().permission === 'owner'"
      color="red"
      @click="askToDeleteFamilyTree = true"
    >
      Delete this Family Tree
    </v-btn>
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
    <v-dialog v-model="askToDeleteFamilyTree" width="auto">
      <v-card
        prepend-icon="mdi-update"
        text="This Family Tree will be deleted permanently!"
        title="Are you sure ?"
      >
        <template v-slot:actions>
          <v-btn
            color="red"
            class="ms-auto"
            text="Ok"
            @click="
              askToDeleteFamilyTree = false;
              FamilyStore().deleteFamilyTree(tree_id);
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
      permissionData: {},
      new_owner: { user_email: "", new_permission: "" },
      tree_id: this.$route.params.id,
      askToChangeOwner: false,
      askToDeleteFamilyTree: false,
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
      const data = await FamilyStore().getPermissions(this.$route.params.id);
      this.permissions = data.permissions;
      this.permissionData = data.permissionData;

      this.new_owner.new_permission = "";
      this.new_owner.user_email = "";
      this.loading = false;
      this.disabledTable = false;
    },
    async deletePermission(user_email) {
      this.loading = true;
      this.disabledTable = true;
      await FamilyStore().deletePermission(this.tree_id, user_email);
      const data = await FamilyStore().getPermissions(this.$route.params.id);
      this.permissions = data.permissions;
      this.permissionData = data.permissionData;

      this.new_owner.new_permission = "";
      this.new_owner.user_email = "";
      this.loading = false;
      this.disabledTable = false;
    },
    async checkUpdatePermission(user_email, new_permission, role_name) {
      if (role_name === "owner") {
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
    const data = await FamilyStore().getPermissions(this.$route.params.id);
    this.permissions = data.permissions;
    this.permissionData = data.permissionData;
  },
};
</script>
