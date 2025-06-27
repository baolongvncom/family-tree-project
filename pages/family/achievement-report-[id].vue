<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex flex-column fill-height align-center justify-center"
  >
    <v-card-title style="color: deepskyblue">Achievement Report</v-card-title>
    <v-card
      color="transparent"
      flat
      class="d-flex flex-row ga-4 align-center mb-2"
    >
      <v-autocomplete
        width="250"
        :items="years"
        v-model="start_year"
        label="Select Start Year"
        :hide-details="validStartEndYear"
      >
      </v-autocomplete>
      <v-autocomplete
        width="250"
        :items="years"
        v-model="end_year"
        label="Select End Year"
        :hide-details="validStartEndYear"
        hint="End Year cannot below Start Year"
        persistent-hint
      >
      </v-autocomplete>
    </v-card>
    <v-btn
      :disabled="!validStartEndYear"
      @click="getReport"
      class="mb-4"
      color="primary"
    >
      Get Achievement Report
    </v-btn>
    <v-data-table :headers="headers" :items="report"> </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "AchievementReport",
  setup() {
    definePageMeta({
      layout: "family",
    });
  },
  data() {
    const currentYear = new Date().getFullYear();
    return {
      currentYear,
      years: Array.from(
        { length: currentYear - 1900 + 1 },
        (_, i) => currentYear - i
      ),
      report: [],
      start_year: currentYear,
      end_year: currentYear,
      tree_id: this.$route.params.id,
      headers: [
        { title: "Achievement Type", key: "type" },
        { title: "Count", key: "count" },
      ],
    };
  },
  computed: {
    validStartEndYear() {
      const start = parseInt(this.start_year);
      const end = parseInt(this.end_year);
      return !isNaN(start) && !isNaN(end) && start <= end;
    },
  },
  methods: {
    async getReport() {
      try {
        const { fetchApi } = useApi();
        const data = await fetchApi(`/api/report/achievement`, {
          method: "POST",
          body: JSON.stringify({
            tree_id: this.tree_id,
            start_year: this.start_year,
            end_year: this.end_year,
          }),
        });

        if (data.success) {
          this.report = data.data;
        } else {
        }
      } catch (err) {
        console.error("Get Achievement Report thất bại:", err);
        navigateTo(`/family/${this.tree_id}`);
      }
    },
  },
};
</script>
