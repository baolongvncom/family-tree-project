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
          <v-switch
            v-model="gender_boolean"
            color="primary"
            :label="gender_boolean ? 'Male' : 'Female'"
          ></v-switch>
          <v-text-field
            v-model="member.full_name"
            label="Full Name"
            type="text"
            placeholder="Full Name"
            :disabled="isDisabledButton"
            required
          ></v-text-field>
          <v-autocomplete
            v-model="member.job"
            :items="jobs"
            label="Job"
            item-title="name"
            item-value="_id"
            placeholder="Job"
          ></v-autocomplete>
          <v-text-field
            v-model="member.description"
            label="Description"
            type="text"
            placeholder="Description"
          ></v-text-field>
          <v-text-field
            v-model="member.address"
            label="Address"
            type="text"
            placeholder="Address"
          ></v-text-field>
          <v-text-field
            v-model="member.date_of_birth"
            label="Date of birth"
            type="date"
            placeholder="Date of birth"
            required
          ></v-text-field>
          <v-autocomplete
            v-model="member.place_of_birth"
            label="Place of birth"
            :items="hometowns"
            item-value="_id"
            item-title="name"
            placeholder="Place of birth"
          ></v-autocomplete>
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
      jobs: [],
      hometowns: [],
      imageUrl: null,
      member: {
        tree_id: "",
        full_name: "",
        job: null,
        gender: "male",
        date_of_birth: new Date().toISOString().split("T")[0],
        place_of_birth: null,
        image: "",
        description: "Hello",
        address: "Unknown",
      },
      file: null,
      isDisabledButton: false,
      familyStore: FamilyStore(),
      gender_boolean: true,
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
      this.member.gender = val ? "male" : "female";
    },
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
  async created() {
    try {
      const { fetchApi } = useApi();
      const data = await fetchApi(`/api/treeinfo/getJobAndHometown`, {
        method: "GET",
      });

      if (data.success) {
        this.jobs = data.jobs;
        this.hometowns = data.hometowns;
        this.member.job = data.jobs.find(h => h.name === "Không")?._id || null;
        this.member.place_of_birth = data.hometowns.find(h => h.name === "Không rõ")?._id || null;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Get Jobs and Hometown thất bại:", err.message);
      navigateTo(`/family/${this.tree_id}`);
    }
  },
};
</script>
