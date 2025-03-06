<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const error = useError();

if (error.value?.statusCode === 404) {
  clearError(); //
  navigateTo("/");
}
</script>
