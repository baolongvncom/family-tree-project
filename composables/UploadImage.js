export async function uploadImage(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("treeInfo", file);

    try {
      const config = useRuntimeConfig();
      const authToken = useCookie("auth-token");
      const response = await fetch(`${config.public.apiBase}/api/upload`, {
        headers: { "auth-token": authToken.value },
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        return data.image_url;
      } else {
        alert("Upload failed: " + data.message);
        return null;
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
      return null;
    }
  }
