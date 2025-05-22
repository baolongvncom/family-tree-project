<template>
  <v-container fluid class="d-flex fill-height align-center justify-center">
    <v-card rounded="xl" width="50%" class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Tạo Family Tree</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-model="code"
          :loading="loading"
          append-inner-icon="mdi-magnify"
          label="Enter Tree Code #XXXXX"
          variant="solo"
          hide-details
          single-line
          @click:append-inner="search"
        ></v-text-field>
        <v-card
          v-if="!treeInfo"
          variant="flat"
          class="mt-4 d-flex justify-center text-h1"
          >No Tree Found</v-card
        >
        <tree-info
          v-else
          :name="treeInfo?.name"
          :description="treeInfo?.description"
          :date="treeInfo?.date"
          :image="treeInfo?.image"
          :url="`/family/${treeInfo?._id}`"
          :role="treeInfo?.role_name ?? 'guest'"
          class="mt-4 w-100"
          @ask="askToView"
        >
        </tree-info>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "SearchTree",
  setup() {
    definePageMeta({
      layout: "home",
    });
  },
  data: () => ({
    treeInfo: null,
    code: "",
    loading: false,
  }),
  methods: {
    async search() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/treeinfo/find`,
          {
            method: "POST",
            body: JSON.stringify({ code: this.code }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          if (data.value?.treeInfo) {
            this.treeInfo = data.value?.treeInfo;
          } else {
            this.code = "";
            this.treeInfo = null;
            alert("Không tìm thấy Tree. Nhập lại Code");
          }
        }
      } catch (err) {
        console.error("Find Tree thất bại:", err);
        alert("Có lỗi trong lúc tìm kiếm Tree. Thử lại sau");
        this.code = "";
        this.treeInfo = null;
      }
    },
    async askToView() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/treeinfo/asktoview`,
          {
            method: "POST",
            body: JSON.stringify({ tree_id: this.treeInfo._id }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.search();
        }
      } catch (err) {
        console.error("Ask to View Tree thất bại:", err);
        alert("Có lỗi trong lúc Ask to View Tree. Thử lại sau");
        this.code = "";
        this.treeInfo = null;
      }
    },
  },
};
</script>
