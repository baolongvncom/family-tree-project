<template>
  <v-card class="d-flex flex-column align-center justify-center">
    <v-data-table
      items-per-page="5"
      :items-per-page-options="itemsPerPageOptions"
      :headers="headers"
      :items="formData"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              :icon="icon || 'mdi-pine-tree'"
              size="x-small"
              start
            ></v-icon>
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.new_name="{ item }">
        <div class="d-flex justify-center">
          <v-text-field
            v-model="item.new_name"
            :readonly="!havePermissionToEdit"
            width="300"
          >
          </v-text-field>
        </div>
      </template>
      <template v-if="havePermissionToEdit" v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-btn
            :disabled="item.new_name === item.name"
            v-if="havePermissionToEdit"
            color="primary"
            @click="updateAttributes(item.new_name, item._id)"
            >Update</v-btn
          >
          <v-btn
            v-if="havePermissionToEdit"
            color="red"
            @click="deleteAttributes(item._id)"
            >Delete</v-btn
          >
        </div>
      </template>
    </v-data-table>
    <v-card
      variant="transparent"
      v-if="havePermissionToEdit"
      class="d-flex pa-4 ga-2 align-center justify-center"
      width="100%"
    >
      <v-text-field
        v-model="newFormData.name"
        density="compact"
        variant="solo"
        label="Name:"
        hide-details
      >
        <template v-slot:append>
          <v-btn
            :disabled="disabledAddButton"
            color="primary"
            @click="addAttributes(newFormData.name)"
          >
            Add New {{ item_name }}
          </v-btn>
        </template>
      </v-text-field>
    </v-card>
  </v-card>
</template>

<script setup>
definePageMeta({
  layout: "family",
});

const props = defineProps({
  name: String,
  role: String,
  item_name: String,
  title: String,
  tree_id: String,
  icon: String,
});

const itemsPerPageOptions = [
  { value: 5, title: "5" },
  { value: 10, title: "10" },
  { value: 20, title: "20" },
  { value: 50, title: "50" },
  { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
];

// Dữ liệu chính
const items = ref([]);

// formData
const formData = ref([]);

// new item form
const newFormData = ref({ name: "" });

// Gọi API khi mounted
const fetchAll = async () => {
  try {
    const result = await useFetchAttributes(props.name, props.tree_id);

    items.value = result?.items || [];
  } catch (err) {
    console.error(`Fail to Fetch ${props.name} Data:`, err);
  }
};

await fetchAll();

// Computed
const disabledAddButton = computed(() => newFormData.value.name == "");

const havePermissionToEdit = computed(
  () => props.role === "owner" || props.role === "editor"
);
const headers = computed(() => {
  if (havePermissionToEdit.value) {
    return [
      { title: "Name", key: "new_name" },
      { title: "Actions", key: "actions", align: "end", sortable: false },
    ];
  }
  return [{ title: "Name", key: "new_name", align: "center" }];
});

// Watch
watch(
  items,
  (newItems) => {
    formData.value = newItems.map((item) => ({
      _id: item._id,
      name: item.name,
      new_name: item.name,
    }));
  },
  { immediate: true, deep: true }
);

async function updateValues() {
  const res = await useFetchAttributes(props.name, props.tree_id);
  items.value = res.items;

  // Reset input
  newFormData.value.name = "";
}

async function updateAttributes(new_attribute_name, attribute_id) {
  const { useFetchApi } = useApi();

  const { data, error } = await useFetchApi(`/api/${props.name}/update`, {
    method: "POST",
    body: JSON.stringify({
      tree_id: props.tree_id,
      new_name: new_attribute_name,
      attribute_id,
    }),
  });

  if (error.value) throw new Error(error.value.message);
  if (data.value.success) {
    updateValues(data.value);
  }
}

async function addAttributes(attribute_name) {
  const { useFetchApi } = useApi();

  const { data, error } = await useFetchApi(`/api/${props.name}/add`, {
    method: "POST",
    body: JSON.stringify({ tree_id: props.tree_id, name: attribute_name }),
  });

  if (error.value) throw new Error(error.value.message);
  if (data.value.success) {
    updateValues(data.value);
  }
}

async function deleteAttributes(attribute_id) {
  const { useFetchApi } = useApi();

  const { data, error } = await useFetchApi(`/api/${props.name}/delete`, {
    method: "POST",
    body: JSON.stringify({ tree_id: props.tree_id, attribute_id }),
  });

  if (error.value) throw new Error(error.value.message);
  if (data.value.success) {
    updateValues(name, data.value);
  }
}
</script>
