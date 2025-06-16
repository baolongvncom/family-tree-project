<template>
  <v-container fluid class="d-flex fill-height">
    <v-row class="fill-height">
      <v-col
        class="d-flex flex-column text-center justify-space-between"
        cols="12"
        md="7"
      >
        <v-card
          class="text-h6 justify-center align-center flex-1-1 d-flex"
          height="fit-content"
          flat
          rounded
        >
          <template v-slot:text>
            <div v-if="!memberStore" class="text-subtitle-1">
              Select a Member
            </div>

            <template v-else>
              <v-card variant="flat" class="d-flex flex-column align-center">
                <v-avatar
                  :image="
                    memberStore.image === ''
                      ? '/dummy_avatar.png'
                      : memberFormData.image
                  "
                  class="mb-2"
                  size="88"
                ></v-avatar>
                <v-file-input
                  v-model="file"
                  label="Chọn ảnh"
                  accept="image/*"
                  v-if="permissionToEdit"
                ></v-file-input>
              </v-card>

              <h3 class="text-h5">{{ memberStore.full_name }}</h3>

              <div class="text-medium-emphasis font-weight-bold">
                {{ memberStore.address }}
              </div>

              <v-divider class="my-4"></v-divider>

              <v-text-field
                v-model="memberFormData.full_name"
                class="mx-auto mb-2"
                density="compact"
                max-width="320"
                prefix="Full Name:"
                variant="solo"
                flat
                hide-details
                :readonly="!permissionToEdit"
              ></v-text-field>
              <v-card flat class="mx-auto mb-2 d-flex justify-center">
                <v-switch
                  :disabled="memberStore.married"
                  v-model="memberFormData.gender"
                  :label="memberFormData.gender"
                  false-value="female"
                  true-value="male"
                  :hide-details="!memberStore.married"
                  hint="You cannot change gender while being married"
                  persistent-hint
                ></v-switch>
              </v-card>
              <v-autocomplete
                v-model="memberFormData.job"
                :items="MemberStore().jobs"
                item-title="name"
                item-value="_id"
                class="mx-auto mb-2"
                density="compact"
                max-width="250"
                prefix="Job:"
                variant="solo"
                flat
                hide-details
                :readonly="!permissionToEdit"
              ></v-autocomplete>
              <v-text-field
                v-model="memberFormData.date_of_birth"
                class="mx-auto mb-2"
                density="compact"
                max-width="300"
                type="date"
                prefix="Date Of Birth:"
                variant="solo"
                flat
                hide-details
                :readonly="!permissionToEdit"
              ></v-text-field>
              <v-autocomplete
                v-model="memberFormData.place_of_birth"
                :items="MemberStore().hometowns"
                item-title="name"
                item-value="_id"
                class="mx-auto"
                density="compact"
                max-width="270"
                prefix="Place of birth:"
                variant="solo"
                flat
                hide-details
                :readonly="!permissionToEdit"
              ></v-autocomplete>
              <v-text-field
                v-model="memberFormData.address"
                class="mx-auto mb-2"
                density="compact"
                max-width="250"
                prefix="Address:"
                variant="solo"
                flat
                hide-details
                :readonly="!permissionToEdit"
              ></v-text-field>
              <v-text-field
                v-model="memberFormData.description"
                class="mx-auto"
                density="compact"
                max-width="250"
                prefix="Description:"
                variant="solo"
                flat
                hide-details
                :readonly="!permissionToEdit"
              ></v-text-field>
              <v-btn
                v-if="permissionToEdit"
                @click="updateMemberInformation"
                :disabled="isDisableUpdateMember"
                color="primary"
                class="mt-4"
                >Update Member Information</v-btn
              >
              <v-btn
                v-if="permissionToEdit"
                @click="askToDeleteMember = true"
                :disabled="editMember"
                color="red"
                class="mt-4"
                >Delete Member</v-btn
              >
            </template>
          </template>
        </v-card>
      </v-col>

      <v-col class="d-flex flex-column text-center" cols="12" md="5">
        <v-card
          class="text-h6 align-center flex-1-1 d-flex flex-column"
          height="50%"
          flat
          rounded
        >
          <v-card width="100%" height="20%" class="d-flex">
            <v-autocomplete
              :readonly="!permissionToEdit"
              v-model="form.parents_relationship_model"
              :items="filtered_couples"
              :item-props="parentsItemProps"
              label="Select Your Parents"
              width="100%"
              persistent-hint
              return-object
            ></v-autocomplete>
          </v-card>
          <v-card
            v-if="memberStore.gender === 'male'"
            width="100%"
            height="20%"
            class="d-flex"
          >
            <v-autocomplete
              :readonly="!permissionToEdit"
              v-model="form.wife"
              :items="filtered_unmarried_members"
              :hint="`${formattedDate(form.wife.date_of_birth) ?? 'None'}, ${
                getHometownName(form.wife.place_of_birth) ?? 'None'
              }`"
              item-title="full_name"
              label="Select Your Wife"
              width="70%"
              persistent-hint
              return-object
            >
            </v-autocomplete>
            <v-text-field
              v-model="form.date_of_marriage"
              :disabled="!form.wife._id"
              label="Date of marriage"
              type="date"
              placeholder="Date of marriage"
              required
              :readonly="!permissionToEdit"
            ></v-text-field>
          </v-card>
          <v-card
            v-if="memberStore.gender === 'female'"
            width="100%"
            height="20%"
            class="d-flex flex-row"
          >
            <v-autocomplete
              :readonly="!permissionToEdit"
              v-model="form.husband"
              :items="filtered_unmarried_members"
              :hint="`${formattedDate(form.husband.date_of_birth) ?? 'None'}, ${
                getHometownName(form.husband.place_of_birth) ?? 'None'
              }`"
              item-title="full_name"
              label="Select Your Husband"
              width="70%"
              persistent-hint
              return-object
            >
            </v-autocomplete>
            <v-text-field
              v-model="form.date_of_marriage"
              label="Date of marriage"
              type="date"
              :disabled="!form.husband._id"
              placeholder="Date of marriage"
              required
              :readonly="!permissionToEdit"
            ></v-text-field>
          </v-card>
          <v-card
            v-if="form.husband._id || form.wife._id"
            width="100%"
            height="20%"
            class="d-flex"
          >
            <v-autocomplete
              :readonly="!permissionToEdit"
              multiple
              v-model="form.children"
              :items="filtered_unparents_members"
              :item-props="itemProps"
              label="Select Your Children"
              width="100%"
              chips
            >
            </v-autocomplete>
          </v-card>
          <v-btn
            v-if="permissionToEdit"
            @click="addRelationship"
            :disabled="isDisableUpdateRelationship"
            color="primary"
            class="mt-4"
            >Update Relationship</v-btn
          >
          <v-btn
            v-if="permissionToEdit"
            @click="deleteCouplesRelationship"
            :disabled="isDisableDeleteCouplesRelationship"
            color="primary"
            class="mt-4"
            >Delete Couples Relationship</v-btn
          >
          <v-btn
            v-if="permissionToEdit"
            @click="askToDeleteMember = true"
            :disabled="isDisableDeleteParentsRelationship"
            color="primary"
            class="mt-4"
            >Delete Parents Relationship</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="askToDeleteMember" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="This Member and all of its information will be deleted forever from this Family Tree !"
        title="Are you sure ?"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            color="red"
            text="Ok"
            @click="
              askToDeleteMember = false;
              deleteMember();
            "
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import isEqual from "lodash/isEqual";

export default {
  name: "MemberDashboard",
  data() {
    return {
      askToDeleteMember: false,
      file: null,
      editRelationship: false,
      editMember: false,
      member_id: this.$route.params.id,
      unmarried_members: [],
      unparents_members: [],
      couples: [],
      form: {
        husband: { _id: "", full_name: "None" },
        wife: { _id: "", full_name: "None" },
        children: [],
        father: { _id: "", full_name: "None" },
        mother: { _id: "", full_name: "None" },
        date_of_marriage: null,
        parents_relationship_model: {},
        parents_relationship: "",
      },
      memberFormData: {
        full_name: "",
        job: null,
        gender: "",
        address: "",
        place_of_birth: null,
        date_of_birth: "",
        description: "",
        image: null,
      },
      genderBoolen: true,
    };
  },
  setup() {
    definePageMeta({
      layout: "member",
    });
  },
  watch: {
    "form.parents_relationship_model"(val) {
      this.form.parents_relationship = val?._id || "";
    },
    file(newFile) {
      if (newFile) {
        this.memberFormData.image = URL.createObjectURL(newFile);
      } else {
        this.memberFormData.image = this.memberStore.image;
      }
    },
  },
  computed: {
    permissionToEdit() {
      return (
        MemberStore().permission === "editor" ||
        MemberStore().permission === "owner"
      );
    },
    filtered_couples() {
      return this.couples
        .filter((item) => item._id !== this.memberStore.couples_relationship)
        .map((item) => ({
          mother: item.data.wife,
          father: item.data.husband,
          couples_name:
            item.data.husband.full_name + " - " + item.data.wife.full_name,
          date_of_birth:
            item.data.husband.date_of_birth +
            " - " +
            item.data.wife.date_of_birth,
          _id: item._id,
        }));
    },
    isDisableUpdateRelationship() {
      return (
        !this.permissionToEdit ||
        this.editRelationship ||
        (this.form.husband === this.memberStore.husband &&
          this.form.wife === this.memberStore.wife &&
          isEqual(this.form.children, this.memberStore.children) &&
          isEqual(this.form.father, this.memberStore.father) &&
          isEqual(this.form.mother, this.memberStore.mother) &&
          this.form.date_of_marriage === this.memberStore.date_of_marriage &&
          this.form.parents_relationship ===
            this.memberStore.parents_relationship)
      );
    },

    isDisableDeleteCouplesRelationship() {
      return (
        this.editRelationship ||
        !this.memberStore.couples_relationship ||
        !this.permissionToEdit
      );
    },
    isDisableDeleteParentsRelationship() {
      return (
        this.editRelationship ||
        !this.memberStore.parents_relationship ||
        !this.permissionToEdit
      );
    },
    isDisableUpdateMember() {
      return (
        this.editMember ||
        !this.permissionToEdit ||
        (this.memberFormData.full_name === this.memberStore.full_name &&
          this.memberFormData.job === this.memberStore.job &&
          this.memberFormData.date_of_birth ===
            this.memberStore.date_of_birth &&
          this.memberFormData.place_of_birth ===
            this.memberStore.place_of_birth &&
          this.memberFormData.address === this.memberStore.address &&
          this.memberFormData.image === this.memberStore.image &&
          this.memberFormData.description === this.memberStore.description &&
          this.memberFormData.gender === this.memberStore.gender)
      );
    },
    memberStore() {
      return MemberStore();
    },
    filtered_unmarried_members() {
      return [
        ...(this.memberStore.husband._id ? [this.memberStore.husband] : ""),
        ...(this.memberStore.wife._id ? [this.memberStore.wife] : ""),
        ...this.unmarried_members,
      ].filter(
        (item) =>
          item?.gender != this.memberStore.gender &&
          item?._id !== this.member_id &&
          !this.memberStore.children.includes(item?._id)
      );
    },

    filtered_unparents_members() {
      return [...this.memberStore.children, ...this.unparents_members].filter(
        (item) =>
          item._id !== this.member_id &&
          item._id !== this.memberStore.wife?._id &&
          item._id !== this.memberStore.husband?._id &&
          item._id !== this.form.husband?._id &&
          item._id !== this.form.wife?._id
      );
    },
  },
  methods: {
    itemProps(item) {
      return {
        title: item.full_name,
        subtitle: item.date_of_birth + ", " + item.place_of_birth,
        value: item._id,
      };
    },
    getHometownName(id) {
      const hometown = MemberStore().hometowns.find((h) => h._id === id);
      return hometown?.name || null;
    },
    formattedDate(date) {
      if (!date) return null;
      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
      };
      return new Date(date).toLocaleString("en-GB", options);
    },
    async updateMemberInformation() {
      this.editMember = true;
      await FamilyStore().updateMember(
        this.member_id,
        this.memberFormData,
        this.file
      );
      await this.fetchData();
      this.file = null;
      this.editMember = false;
    },
    parentsItemProps(item) {
      return {
        title: item.couples_name,
        subtitle: item.date_of_birth,
        value: item._id,
      };
    },
    async addRelationship() {
      let isAdded = false;
      try {
        this.editRelationship = true;

        if (this.form.wife._id || this.form.husband._id) {
          const partner_id =
            this.memberStore.gender === "male"
              ? this.form.wife?._id
              : this.form.husband?._id;

          await this.memberStore.deleteCouplesRelationship();
          await this.memberStore.addCoupleRelationship(
            partner_id,
            this.form.children,
            this.form.date_of_marriage
          );

          isAdded = true;
        }

        if (this.form.parents_relationship) {
          await this.memberStore.deleteParentsRelationship();
          await this.memberStore.addParentsRelationship(
            this.form.parents_relationship
          );

          isAdded = true;
        }
      } catch (error) {
        alert("Lỗi khi cập nhật mối quan hệ: " + error);
      } finally {
        this.editRelationship = false;
        if (isAdded) await this.fetchData();
      }
    },
    async deleteParentsRelationship() {
      let isAdded = false;
      if (this.memberStore.parents_relationship) {
        this.editRelationship = true;
        await this.memberStore.deleteParentsRelationship();
        this.editRelationship = false;
        isAdded = true;
      }
      if (isAdded) await this.fetchData();
    },
    async deleteMember() {
      this.editRelationship = true;
      this.editMember = true;
      await MemberStore().deleteMember();
      this.editRelationship = false;
      this.editMember = false;
    },
    async deleteCouplesRelationship() {
      let isAdded = false;
      if (this.memberStore.couples_relationship) {
        this.editRelationship = true;
        await this.memberStore.deleteCouplesRelationship();
        this.editRelationship = false;
        isAdded = true;
      }
      if (isAdded) await this.fetchData();
    },
    async fetchData() {
      await MemberStore().getMember(this.member_id);
      await Promise.all([
        MemberStore().getCouplesRelationship(),
        MemberStore().getParentsRelationship(),
        MemberStore()
          .getUnmarried()
          .then((data) => (this.unmarried_members = data)),
        MemberStore()
          .getUnparents()
          .then((data) => (this.unparents_members = data)),
        MemberStore()
          .getCouples()
          .then((data) => (this.couples = data)),
      ]);

      this.memberFormData.full_name = MemberStore().full_name;
      this.memberFormData.job = MemberStore().job;
      this.memberFormData.gender = MemberStore().gender;
      this.memberFormData.address = MemberStore().address;
      this.memberFormData.place_of_birth = MemberStore().place_of_birth;
      this.memberFormData.date_of_birth = MemberStore().date_of_birth;
      this.memberFormData.description = MemberStore().description;
      this.memberFormData.image = MemberStore().image;

      this.form = {
        husband: MemberStore().husband,
        wife: MemberStore().wife,
        children: MemberStore().children,
        father: MemberStore().father,
        mother: MemberStore().mother,
        date_of_marriage: MemberStore().date_of_marriage,
      };
      this.form.parents_relationship = this.memberStore.parents_relationship;
      this.form.parents_relationship_model = this.filtered_couples.find(
        (item) => item._id === this.memberStore.parents_relationship
      );
    },
  },
  async created() {
    await this.fetchData();
  },
};
</script>
