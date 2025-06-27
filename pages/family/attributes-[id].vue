<template>
  <v-container
    width="fit-content"
    fluid
    class="d-flex fill-height align-center justify-center ga-10"
  >
    <edit-attribute
      title="Jobs"
      :tree_id="tree_id"
      name="jobs"
      item_name="Job"
      :role="role"
      icon="mdi-account-hard-hat-outline"
    />
    <edit-attribute
      title="Hometowns"
      :tree_id="tree_id"
      name="hometowns"
      item_name="Hometown"
      :role="role"
      icon="mdi-home-circle-outline"
    />
    <edit-attribute
      title="Gravesites"
      :tree_id="tree_id"
      name="gravesites"
      item_name="Gravesite"
      :role="role"
      icon="mdi-grave-stone"
    />
    <edit-attribute
      title="DeathCauses"
      :tree_id="tree_id"
      name="deathcauses"
      item_name="DeathCause"
      :role="role"
      icon="mdi-coffin"
    />
    <edit-attribute
      title="AchievementTypes"
      :tree_id="tree_id"
      name="achievementtypes"
      item_name="AchievementType"
      :role="role"
      icon="mdi-trophy-award"
    />
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "family",
});
const route = useRoute();
const tree_id = route.params.id;
const role = ref(null);

// Gọi API khi mounted
const fetchAll = async () => {
  try {
    const permsRes = await useFetchAttributes("permission", tree_id);

    role.value = permsRes?.permission || null;
  } catch (err) {
    console.error("Fail to Fetch Role Data:", err);
  }
};

await fetchAll();
</script>
