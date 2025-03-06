export default defineNuxtPlugin((nuxtApp) => {
    const auth = authenticated(); // Hàm kiểm tra authentication
  
    // Override useFetch
    nuxtApp.provide('fetch', async (url: string, options: any = {}) => {
      if (!auth) {
        UserStore().signOut();
        return Promise.reject('Unauthorized');
      }
  
      return await $fetch(url, options);
    });
  });
  
  