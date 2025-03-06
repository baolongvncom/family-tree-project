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
          achivements
        </v-card>
      </v-col>

      <v-col class="d-flex text-center" cols="12" md="5">
        <v-card
          class="text-h6 justify-center align-center flex-1-1 d-flex flex-column"
          height="50%"
          flat
          rounded
        >
          <v-select
            v-if="memberStore.gender === 'male'"
            v-model="wife"
            :items="filtered_unmarried_members"
            :hint="`${wife ? husband.date_of_birth : 'None'}, ${
              wife ? husband.place_of_birth : 'None'
            }`"
            item-title="full_name"
            item-value="_id"
            label="Select Your Wife"
            width="100%"
            persistent-hint
            return-object
          >
          </v-select>
          <v-select
            v-if="memberStore.gender === 'female'"
            v-model="husband"
            :items="filtered_unmarried_members"
            :hint="`${husband ? husband.date_of_birth : 'None'}, ${
              husband ? husband.place_of_birth : 'None'
            }`"
            item-title="full_name"
            item-value="_id"
            label="Select Your Husband"
            width="100%"
            persistent-hint
            return-object
          >
          </v-select>
          <v-select
            multiple
            v-model="children"
            :items="filtered_unparents_members"
            item-title="full_name"
            item-value="_id"
            label="Select Your Children"
            width="100%"
            chips
          >
          </v-select>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { MemberStore } from "~/stores/MemberStore";

export default {
  name: "MemberDashboard",
  data() {
    return {
      relationsip: {},
      husband: null,
      wife: null,
      children: [],
      editRelationship: false,
      member_id: this.$route.params.id,
      unmarried_members: [],
      unparents_members: [],
    };
  },
  setup() {
    definePageMeta({
      layout: "member",
    });
  },
  computed: {
    memberStore() {
      return MemberStore();
    },
    filtered_unmarried_members() {
      const partner_id =
        this.memberStore.gender === "male" ? this.wife?._id : this.husband?._id;
      return this.unmarried_members.filter(
        (item) =>
          (item?._id !== this.member_id &&
            !this.children.includes(item?._id)) ||
          item?._id === partner_id
      );
    },
    filtered_unparents_members() {
      return this.unparents_members.filter(
        (item) =>
          item._id !== this.member_id &&
          item._id !== this.wife?._id &&
          item._id !== this.husband?._id
      );
    },
  },
  methods: {
    addRelationship() {
      if (this.wife || this.husband) {
        const partner_id =
          this.memberStore.gender === "male"
            ? this.wife?._id
            : this.husband?._id;
        this.memberStore.addCoupleRelationship(
          this.member_id,
          partner_id,
          this.children
        );
      }
    },
  },
  async created() {
    this.memberStore.getMember(this.member_id);
    [this.relationsip, this.unmarried_members, this.unparents_members] =
      await Promise.all([
        this.memberStore.getRelationship(this.member_id),
        this.memberStore.getUnmarried(this.member_id),
        this.memberStore.getUnparents(this.member_id),
      ]);

    if (this.relationsip.type && this.relationsip.type == "couples") {
      this.husband = this.relationsip.data.husband;
      this.wife = this.relationsip.data.wife;
      this.children = this.relationsip.data.children;
    } else {
      this.editRelationship = true;
    }
  },
};
</script>
