<template>
  <v-container
    width="60vw"
    fluid
    class="d-flex fill-height align-center justify-center"
  >
    <v-row justify="space-between" dense>
      <v-col cols="12" md="7">
        <v-treeview
          v-model:activated="active"
          v-model:opened="open"
          :items="family"
          item-title="full_name"
          item-value="_id"
          activatable
          border
          open-on-click
          fluid
          rounded
          height="41vh"
        >
          <template v-slot:prepend="{ item }">
            <v-icon v-if="!item.children" icon="mdi-account"></v-icon>
          </template>
        </v-treeview>
      </v-col>

      <v-col class="d-flex text-center" cols="12" md="5">
        <v-card
          class="text-h6 justify-center align-center flex-1-1 d-flex"
          height="100%"
          flat
          rounded
        >
          <template v-slot:text>
            <div v-if="!selected" class="text-subtitle-1">Select a Member</div>

            <template v-else>
              <v-avatar
                :image="
                  selected.image === '' ? '/dummy_avatar.png' : selected.image
                "
                class="mb-2"
                size="88"
              ></v-avatar>

              <h3 class="text-h5">{{ selected.full_name }}</h3>

              <div class="text-medium-emphasis">{{ selected.gender }}</div>

              <div class="text-medium-emphasis font-weight-bold">
                {{ selected.address }}
              </div>

              <v-divider class="my-4"></v-divider>

              <v-text-field
                :model-value="selected.date_of_birth"
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
                :model-value="selected.address"
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
                :model-value="selected.description"
                class="mx-auto"
                density="compact"
                max-width="250"
                prefix="Description:"
                variant="solo"
                flat
                hide-details
                readonly
              ></v-text-field>
              <v-btn
                :to="`/member/${selected._id}`"
                color="primary"
                variant="elevated"
              >
                View
              </v-btn>
            </template>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FamilyDashboard",
  setup() {
    definePageMeta({
      layout: "family",
    });
  },
  data() {
    return {
      tree_id: this.$route.params.id,
      active: [],
      open: [],
    };
  },
  computed: {
    family() {
      return FamilyStore().family;
    },
    selected() {
      return this.active.length
        ? this.family.find((user) => user._id === this.active[0])
        : null;
    },
  },
  async created() {
    await FamilyStore().getFamily(this.tree_id);
  },
};
</script>
