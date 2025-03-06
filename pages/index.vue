<template>
  <v-container>
    <v-row>
      <template v-for="n in Math.ceil(treeInfos.length / 6)" :key="n">
        <v-col
          v-for="j in Math.min(6, treeInfos.length - (n - 1) * 6)"
          :key="`${n}${j}`"
          cols="6"
          md="2"
        >
          <tree-info
            :name="treeInfos[(n - 1) * 6 + (j - 1)].name"
            :description="treeInfos[(n - 1) * 6 + (j - 1)].description"
            :date="treeInfos[(n - 1) * 6 + (j - 1)].date"
            :image="treeInfos[(n - 1) * 6 + (j - 1)].image"
            :to="`/family/${treeInfos[(n - 1) * 6 + (j - 1)]._id}`"
          ></tree-info>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Dashboard",
  setup() {
    definePageMeta({
      layout: "home",
    });
  },
  computed: {
    treeInfos() {
      return TreeInfoStore().treeInfos;
    },
  },
  created() {
    TreeInfoStore().getTreeInfos();
  },
};
</script>
