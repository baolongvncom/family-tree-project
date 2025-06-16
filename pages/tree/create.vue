<script>
export default {
  setup() {
    definePageMeta({
      layout: "home",
    });
  },
  data() {
    return {
      imageUrl: null,
      treeInfo: { name: "", image: "", description: "", role: {} },
      file: null,
      isDisabledButton: false,
      userStore: UserStore(),
    };
  },
  computed: {
    isButtonDisabled() {
      return this.isDisabledButton || !this.treeInfo.name.trim();
    },
  },
  watch: {
    file(newFile) {
      if (newFile) {
        this.imageUrl = URL.createObjectURL(newFile);
      } else {
        this.imageUrl = null;
      }
    },
  },
  methods: {
    async addTreeInfo() {
      this.isDisabledButton = true;
      try {
        await TreeInfoStore().addTreeInfo(this.treeInfo, this.file);
      } finally {
        this.isDisabledButton = false;
      }
    },
  },
};
</script>

<template>
  <v-container fluid class="d-flex fill-height align-center justify-center">
    <v-card rounded="xl" width="50%" class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Create new Family Tree</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <form @submit.prevent="addTreeInfo">
          <v-file-input
            v-model="file"
            label="Chọn ảnh"
            accept="image/*"
          ></v-file-input>

          <v-img
            :src="imageUrl"
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
              >Create Family Tree</v-btn
            >
          </v-layout>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
