<script>
export default {
  setup() {
    definePageMeta({
      layout: "family",
    });
  },
  data() {
    return {
      tree_id: this.$route.params.id,
      treeInfo: { name: "", image: "", description: "" },
      file: null,
      isDisabledButton: false,
    };
  },
  computed: {
    isButtonDisabled() {
      return (
        !this.isDisabledButton ||
        this.treeInfo.name === FamilyStore().family_name &&
        this.treeInfo.image === FamilyStore().image &&
        this.treeInfo.description === FamilyStore().description
      );
    },
  },
  methods: {
    async updateTreeInfo() {
      this.isDisabledButton = true;
      try {
        await FamilyStore().updateFamily(this.tree_id, this.treeInfo, this.file);
      } finally {
        this.isDisabledButton = false;
      }
    },
  },
  async created() {
    // Watch file
    await FamilyStore().getFamily(this.tree_id);
    watch(
      () => this.file,
      (newFile) => {
        if (newFile) {
          this.treeInfo.image = URL.createObjectURL(newFile);
        } else {
          this.treeInfo.image = FamilyStore().image;
        }
      },
      { immediate: true }
    );
    // Watch name
    watch(
      () => FamilyStore().family_name,
      (newVal) => {
        this.treeInfo.name = newVal;
      },
      { immediate: true }
    );

    // Watch description
    watch(
      () => FamilyStore().description,
      (newVal) => {
        this.treeInfo.description = newVal;
      },
      { immediate: true }
    );

    // Watch image
    watch(
      () => FamilyStore().image,
      (newVal) => {
        this.treeInfo.image = newVal;
      },
      { immediate: true }
    );
  },
};
</script>

<template>
  <v-container fluid class="d-flex fill-height align-center justify-center">
    <v-card rounded="xl" width="50%" class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Update Family Tree Information</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <form @submit.prevent="updateTreeInfo">
          <v-file-input
            v-model="file"
            label="Chọn ảnh"
            accept="image/*"
          ></v-file-input>

          <v-img
            :src="treeInfo.image"
            lazy-src="/family-tree.png"
            height="300"
            alt="Empty Image"
          ></v-img>

          <v-text-field
            v-model="treeInfo.name"
            label="Name"
            type="text"
            placeholder="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="treeInfo.description"
            label="Description"
            type="text"
            placeholder="Description"
          ></v-text-field>
          <v-layout class="d-flex flex-column align-center">
            <v-btn
              type="submit"
              class="mt-4"
              color="primary"
              :disabled="isButtonDisabled"
              >Update Family Tree Information</v-btn
            >
          </v-layout>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
