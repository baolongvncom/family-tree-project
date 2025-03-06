import { useCookie } from "#app";

export async function authenticated() {
  try {
    const authToken = useCookie("auth-token");
    if (!authToken.value) return false;

    const config = useRuntimeConfig();
    const { data, error } = await useFetch(`${config.public.apiBase}/api/isuser`, {
      method: "GET",
      headers: { "auth-token": authToken.value },
    });

    if (error.value) {
      throw new Error(error.value.message);
    }
    UserStore().email = data.value?.email;
    UserStore().username = data.value?.username;
    UserStore().authenticated = true;

    return data.value?.success || false;
  } catch (err) {
    console.error("Authentication check failed:", err);
    return false;
  }
}
