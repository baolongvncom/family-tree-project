<template>
  <v-container fluid class="d-flex fill-height align-center justify-center">
    <v-card rounded="xl" width="50%" class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Thêm Family Member</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <form @submit.prevent="addFamilyMember">
          <v-file-input
            v-model="file"
            label="Chọn ảnh"
            accept="image/*"
            :disabled="isDisabledButton"
          ></v-file-input>

          <v-img
            :src="imageUrl"
            lazy-src="/dummy_avatar.png"
            height="300"
            alt="Empty Image"
          ></v-img>
          <v-switch v-model="gender_boolean" color="primary" label="Gender"></v-switch>
          <v-text-field
            v-model="member.full_name"
            label="Full Name"
            type="text"
            placeholder="Full Name"
            :disabled="isDisabledButton"
            required
          ></v-text-field>
          <!-- <v-text-field
            v-model="treeInfo.description"
            label="Description"
            type="text"
            placeholder="Description"
          ></v-text-field> -->
          <v-layout class="d-flex flex-column align-center">
            <v-btn
              type="submit"
              class="mt-4"
              color="primary"
              :disabled="isButtonDisabled"
              >Thêm Family Member</v-btn
            >
          </v-layout>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  setup() {
    definePageMeta({
      layout: "family",
    });
  },
  data() {
    return {
      imageUrl: null,
      member: {
        tree_id: "",
        full_name: "",
        job: "engineer",
        gender: "male",
        date_of_birth: "1/4/2003",
        place_of_birth: "Quang Nam",
        image: "",
        description: "Hello everyone",
        address: "Tam ky, Quang Nam",
      },
      file: null,
      isDisabledButton: false,
      familyStore: FamilyStore(),
      gender_boolean: false,
    };
  },
  computed: {
    isButtonDisabled() {
      return this.isDisabledButton || !this.member.full_name.trim();
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
    gender_boolean(val) {
      this.member.gender = val ? 'female' : 'male';
    }
  },
  methods: {
    async addFamilyMember() {
      this.isDisabledButton = true;
      try {
        this.member.tree_id = this.$route.params.id;
        await this.familyStore.addMember(this.member, this.file);
      } finally {
        this.isDisabledButton = false;
      }
    },
  },
};
</script>
