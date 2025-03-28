export function useApi() {
  // Hàm sử dụng `useFetch`
  const useFetchApi = async (url, options = {}) => {
    const config = useRuntimeConfig();
    const authToken = useCookie("auth-token");
    return await useFetch(`${config.public.apiBase}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken.value,
        ...options.headers,
      },
    });
  };

  // Hàm sử dụng `fetch`
  const fetchApi = async (url, options = {}) => {
    try {
      const config = useRuntimeConfig();
      const authToken = useCookie("auth-token");
      const response = await fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken.value,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch API error:", error);
      throw error;
    }
  };

  return { useFetchApi, fetchApi };
}
