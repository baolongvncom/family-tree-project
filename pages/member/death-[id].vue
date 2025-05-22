<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex flex-column fill-height align-center justify-center"
  >
    <v-card variant="flat" class="d-flex flex-column align-center">
      <v-avatar
        :image="member?.image === '' ? '/dummy_avatar.png' : member?.image"
        class="mb-2"
        size="88"
      ></v-avatar>
    </v-card>

    <h3 class="text-h5">{{ member?.full_name }}</h3>

    <div class="text-medium-emphasis">{{ member?.gender }}</div>

    <div class="text-medium-emphasis font-weight-bold">
      {{ member?.date_of_birth }}
    </div>

    <v-divider class="my-4"></v-divider>

    <v-card class="d-flex flex-row">
      <v-col class="justify-center">
        <v-autocomplete
          v-model="death_formData.gravesite_id"
          :items="graveSites"
          item-value="_id"
          item-title="name"
          label="GraveSite"
          width="250"
          :readonly="!permissionToEdit"
        ></v-autocomplete>
        <v-autocomplete
          v-model="death_formData.deathcause_id"
          :items="deathCauses"
          item-value="_id"
          item-title="name"
          label="Cause Of Death"
          width="250"
          :readonly="!permissionToEdit"
        ></v-autocomplete>
      </v-col>
      <v-divider vertical thickness="10"></v-divider>
      <v-col>
        <v-text-field
          v-model="death_formData.date_of_death"
          class="mx-auto mb-2"
          density="compact"
          width="330"
          type="date"
          prefix="Date Of Death:"
          variant="solo"
          flat
          hide-details
          :readonly="!permissionToEdit"
        ></v-text-field>
        <v-text-field
          :readonly="!permissionToEdit"
          v-model="death_formData.time_of_death"
          :active="timeMenu"
          :focus="timeMenu"
          class="mt-9"
          label="Death Time"
          prepend-icon="mdi-clock-time-four-outline"
        >
          <v-menu
            :disabled="!permissionToEdit"
            v-model="timeMenu"
            :close-on-content-click="false"
            activator="parent"
            transition="scale-transition"
          >
            <v-time-picker
              v-if="timeMenu"
              v-model="death_formData.time_of_death"
              format="24hr"
              full-width
            ></v-time-picker>
          </v-menu>
        </v-text-field>
      </v-col>
    </v-card>

    <v-btn
      v-if="!member?.death_id && permissionToEdit"
      class="mt-6"
      color="primary"
      @click="addDeath"
    >
      Add Death Information
    </v-btn>

    <v-card
      variant="transparent"
      class="d-flex flex-row ga-5 mt-10"
      v-if="member?.death_id && permissionToEdit"
    >
      <v-btn
        :disabled="!isUpdateDeathInformation"
        color="green"
        @click="updateDeath"
      >
        Update Death Information
      </v-btn>
      <v-btn color="red" @click="deleteDeath"> Delete Death Information </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import isEqual from "lodash/isEqual";

export default {
  name: "Death",
  data() {
    return {
      timeMenu: false,
      member_id: this.$route.params.id,
      member: null,
      death: {
        date_of_death: new Date().toISOString().split("T")[0],
        time_of_death: "00:00",
        deathcause_id: null,
        gravesite_id: null,
      },
      death_formData: {
        date_of_death: new Date().toISOString().split("T")[0],
        time_of_death: "00:00",
        deathcause_id: null,
        gravesite_id: null,
      },
      graveSites: [],
      deathCauses: [],
      role: null,
    };
  },
  setup() {
    definePageMeta({
      layout: "member",
    });
  },
  computed: {
    isUpdateDeathInformation() {
      return (
        this.death?.gravesite_id !== this.death_formData.gravesite_id ||
        this.death?.deathcause_id !== this.death_formData.deathcause_id ||
        this.death?.time_of_death !== this.death_formData.time_of_death ||
        this.death?.date_of_death !== this.death_formData.date_of_death
      );
    },
    permissionToEdit() {
      return this.role === "owner" || this.role === "editor";
    },
  },
  methods: {
    async addDeath() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/death/add`, {
          method: "POST",
          body: JSON.stringify({
            member_id: this.member_id,
            date_of_death: this.death_formData.date_of_death,
            time_of_death: this.death_formData.time_of_death,
            gravesite_id: this.death_formData.gravesite_id,
            deathcause_id: this.death_formData.deathcause_id,
          }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getDeath();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Add Achievements thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async getDeath() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/death/get`, {
          method: "POST",
          body: JSON.stringify({ member_id: this.member_id }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.death = data.value.death;
          this.member = data.value.member;
          this.graveSites = data.value.graveSites;
          this.deathCauses = data.value.deathCauses;
          this.role = data.value.role;
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Get Death Information thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async updateDeath() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/death/update`, {
          method: "POST",
          body: JSON.stringify({
            gravesite_id: this.death_formData.gravesite_id,
            deathcause_id: this.death_formData.deathcause_id,
            date_of_death: this.death_formData.date_of_death,
            time_of_death: this.death_formData.time_of_death,
            member_id: this.member_id,
          }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getDeath();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Update Death Information thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async deleteDeath() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/death/delete`, {
          method: "POST",
          body: JSON.stringify({ member_id: this.member_id }),
        });
        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getDeath();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Delete Death Information thất bại:", err);
        navigateTo(`/member/${this.member_id}`);
      }
    },
  },
  async created() {
    await this.getDeath();
  },
  watch: {
    death: {
      handler(newDeath) {
        this.death_formData.time_of_death =
          newDeath?.time_of_death ?? this.death_formData.time_of_death;
        this.death_formData.date_of_death =
          newDeath?.date_of_death ?? this.death_formData.date_of_death;
        this.death_formData.gravesite_id = newDeath?.gravesite_id;
        this.death_formData.deathcause_id = newDeath?.deathcause_id;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
