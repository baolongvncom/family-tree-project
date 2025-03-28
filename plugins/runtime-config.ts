export default defineNuxtPlugin((NuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
});
