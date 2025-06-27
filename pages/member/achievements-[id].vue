<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex flex-column fill-height align-center justify-center"
  >
    <v-data-table :headers="headers" :items="achievements_formData">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-pine-tree"
              size="x-small"
              start
            ></v-icon>
            {{ member_fullname }}
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.new_type="{ item }">
        <div class="d-flex justify-center">
          <v-autocomplete
            v-model="item.new_type"
            :items="achievementTypes"
            item-value="_id"
            item-title="name"
            :readonly="!havePermissionToEdit"
          >
          </v-autocomplete>
        </div>
      </template>
      <template v-slot:item.date="{ item }">
        <div class="d-flex justify-center">
          {{ item.date }}
        </div>
      </template>
      <template v-if="havePermissionToEdit" v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-btn
            :disabled="item.new_type === item.type"
            v-if="havePermissionToEdit"
            color="primary"
            @click="updateAchievement(item.new_type, item._id)"
            >Update</v-btn
          >

          <v-btn
            v-if="havePermissionToEdit"
            color="red"
            @click="deleteAchievement(item._id)"
            >Delete</v-btn
          >
        </div>
      </template>
    </v-data-table>
    <v-card class="d-flex mt-4">
      <v-text-field
        v-model="member_fullname"
        class="mx-auto"
        density="compact"
        width="320"
        prefix="Fullname:"
        variant="solo"
        flat
        hide-details
        :readonly="true"
      ></v-text-field>
      <v-autocomplete
        v-model="newAchievementFormData.achievementType_id"
        :items="achievementTypes"
        item-value="_id"
        item-title="name"
        label="Select Achievement Type"
        width="250"
      ></v-autocomplete>
      <v-text-field
        v-model="newAchievementFormData.date"
        class="mx-auto"
        density="compact"
        max-width="250"
        prefix="Date:"
        variant="solo"
        flat
        type="date"
        hide-details
      ></v-text-field>
    </v-card>
    <v-btn :disabled="disabledAddButton" class="mt-2" v-if="havePermissionToEdit" color="primary" @click="addAchievement">
      Add New Achievement
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Achievements",
  data() {
    return {
      role: null,
      member_id: this.$route.params.id,
      member_fullname: "",
      achievements: [],
      achievements_formData: [],
      achievementTypes: [],
      newAchievementFormData: {
        date: new Date().toISOString().split("T")[0],
        member_id: this.$route.params.id,
        achievementType_id: null,
      },
    };
  },
  setup() {
    definePageMeta({
      layout: "member",
    });
  },
  computed: {
    disabledAddButton() {
      return this.newAchievementFormData.achievementType_id == null;
    },
    havePermissionToEdit() {
      return this.role === "owner" || this.role === "editor";
    },
    headers() {
      if (this.havePermissionToEdit) {
        return [
          { title: "Type", key: "new_type" },
          { title: "Date", key: "date" },
          { title: "Actions", key: "actions", align: "end", sortable: false },
        ];
      }
      return [
        { title: "Type", key: "new_type", align: "center" },
        { title: "Date", key: "date", align: "center" },
      ];
    },
  },
  methods: {
    async addAchievement() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/achievement/add`, {
          method: "POST",
          body: JSON.stringify({
            member_id: this.member_id,
            date: this.newAchievementFormData.date,
            achievementType_id: this.newAchievementFormData.achievementType_id,
          }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getAchievement();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Add Achievements thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async getAchievement() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/achievement/get`, {
          method: "POST",
          body: JSON.stringify({ member_id: this.member_id }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.achievements = data.value.achievements;
          this.achievementTypes = data.value.achievementTypes;
          this.member_fullname = data.value.member_fullname;
          this.role = data.value.role;
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Get Achievements thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async updateAchievement(achievementType_id, achievement_id) {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/achievement/update`, {
          method: "POST",
          body: JSON.stringify({
            achievementType_id,
            achievement_id,
            member_id: this.member_id,
          }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getAchievement();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Update Achievements thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async deleteAchievement(achievement_id) {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/achievement/delete`, {
          method: "POST",
          body: JSON.stringify({ achievement_id, member_id: this.member_id }),
        });
        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getAchievement();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Delete Achievements thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
  },
  async created() {
    await this.getAchievement();
  },
  watch: {
    achievements: {
      handler(newAchievements) {
        this.achievements_formData = newAchievements.map((achievement) => ({
          _id: achievement._id,
          name: achievement.type.name,
          type: achievement.type._id,
          date: achievement.date,
          new_type: achievement.type._id,
        }));
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
