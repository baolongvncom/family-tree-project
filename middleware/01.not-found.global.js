export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();
  if (!router.resolve(to.fullPath).matched.length) {
    return navigateTo("/");
  }
});
