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
          height="50%"
          flat
          rounded
        >
          <template v-slot:text>
            <div v-if="!memberStore" class="text-subtitle-1">
              Select a Member
            </div>

            <template v-else>
              <v-avatar
                :image="
                  memberStore.image === ''
                    ? '/dummy_avatar.png'
                    : memberStore.image
                "
                class="mb-2"
                size="88"
              ></v-avatar>

              <h3 class="text-h5">{{ memberStore.full_name }}</h3>

              <div class="text-medium-emphasis">{{ memberStore.gender }}</div>

              <div class="text-medium-emphasis font-weight-bold">
                {{ memberStore.address }}
              </div>

              <v-divider class="my-4"></v-divider>

              <v-text-field
                :model-value="memberStore.date_of_birth"
                class="mx-auto mb-2"
                density="compact"
                max-width="250"
                prefix="Date Of Birth:"
                variant="solo"
                flat
                hide-details
                readonly
              ></v-text-field>

              <v-text-field
                :model-value="memberStore.address"
                class="mx-auto mb-2"
                density="compact"
                max-width="250"
                prefix="Address:"
                variant="solo"
                flat
                hide-details
                readonly
              ></v-text-field>

              <v-text-field
                :model-value="memberStore.description"
                class="mx-auto"
                density="compact"
                max-width="250"
                prefix="Description:"
                variant="solo"
                flat
                hide-details
                readonly
              ></v-text-field>
              <v-text-field
                :model-value="memberStore.married"
                class="mx-auto"
                density="compact"
                max-width="250"
                prefix="Married:"
                variant="solo"
                flat
                hide-details
                readonly
              ></v-text-field>
            </template>
          </template>
        </v-card>
        <v-card
          class="text-h6 justify-center align-center flex-1-1 d-flex"
          height="50%"
          flat
          rounded
        >
          {{ form.parents_relationship }}
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
            <v-select
              v-model="form.parents_relationship_model"
              :items="filtered_couples"
              :item-props="parentsItemProps"
              label="Select Your Parents"
              width="100%"
              persistent-hint
              return-object
            ></v-select>
          </v-card>
          <v-card
            v-if="memberStore.gender === 'male'"
            width="100%"
            height="20%"
            class="d-flex"
          >
            <v-select
              v-model="form.wife"
              :items="filtered_unmarried_members"
              :hint="`${form.wife.date_of_birth ?? 'None'}, ${
                form.wife.place_of_birth ?? 'None'
              }`"
              item-title="full_name"
              item-value="_id"
              label="Select Your Wife"
              width="100%"
              persistent-hint
              return-object
            >
            </v-select>
          </v-card>
          <v-card
            v-if="memberStore.gender === 'female'"
            width="100%"
            height="20%"
            class="d-flex"
          >
            <v-select
              v-model="form.husband"
              :items="filtered_unmarried_members"
              :hint="`${form.husband.date_of_birth ?? 'None'}, ${
                form.husband.place_of_birth ?? 'None'
              }`"
              item-title="full_name"
              item-value="_id"
              label="Select Your Husband"
              width="100%"
              persistent-hint
              return-object
            >
            </v-select>
          </v-card>
          <v-card width="100%" height="20%" class="d-flex">
            <v-select
              multiple
              v-model="form.children"
              :items="filtered_unparents_members"
              :item-props="itemProps"
              label="Select Your Children"
              width="100%"
              chips
            >
            </v-select>
          </v-card>
          <v-btn
            @click="addRelationship"
            :disabled="isDisableUpdateRelationship"
            color="primary"
            class="mt-4"
            >Update Relationsip</v-btn
          >
          <v-btn
            @click="deleteCouplesRelationship"
            :disabled="isDisableDeleteCouplesRelationship"
            color="primary"
            class="mt-4"
            >Delete Couples Relationsip</v-btn
          >
          <v-btn
            @click="deleteParentsRelationship"
            :disabled="isDisableDeleteParentsRelationship"
            color="primary"
            class="mt-4"
            >Delete Parents Relationsip</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import isEqual from "lodash/isEqual";

export default {
  name: "MemberDashboard",
  data() {
    return {
      editRelationship: false,
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
        parents_relationship_model: {},
        parents_relationship: "",
      },
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
  },
  computed: {
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
        this.editRelationship ||
        (this.form.husband === this.memberStore.husband &&
          this.form.wife === this.memberStore.wife &&
          isEqual(this.form.children, this.memberStore.children) &&
          this.form.father === this.memberStore.father &&
          this.form.mother === this.memberStore.mother &&
          this.form.parents_relationship ===
            this.memberStore.parents_relationship)
      );
    },
    isDisableDeleteCouplesRelationship() {
      return this.editRelationship || !this.memberStore.couples_relationship;
    },
    isDisableDeleteParentsRelationship() {
      return this.editRelationship || !this.memberStore.parents_relationship;
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
            this.form.children
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
      // if (MemberStore().tree_id !== FamilyStore().tree_id)
      //   await FamilyStore().getFamily(MemberStore().tree_id);
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

      this.form = {
        husband: MemberStore().husband,
        wife: MemberStore().wife,
        children: MemberStore().children,
        father: MemberStore().father,
        mother: MemberStore().mother,
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
