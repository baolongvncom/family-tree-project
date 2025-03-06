<template>
    <div>
        {{UserStore().email}}
        {{ UserStore().username }}
    </div>
</template>

<script>
export default {
  name: "Account",
  setup() {
    definePageMeta({
      layout: 'home', 
    });
  },
};
</script>