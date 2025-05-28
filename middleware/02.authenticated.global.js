export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuthenticated = await authenticated();

  if (!isAuthenticated && !["/signin", "/signup", "/change-password"].includes(to.path)) {
    return navigateTo("/signin");
  }

  if (isAuthenticated && ["/signin", "/signup"].includes(to.path)) {
    return navigateTo("/");
  }
});
