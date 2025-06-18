export async function uploadImage(file) {
  if (!file) return null;

  // 👉 Nén hình ảnh trước khi upload
  const compressedFile = await compressImage(file, 0.6);

  const formData = new FormData();
  formData.append("treeInfo", compressedFile);

  try {
    const config = useRuntimeConfig();
    const authToken = useCookie("auth-token");
    const response = await fetch(`${config.public.apiBase}/api/upload`, {
      method: "POST",
      headers: {
        "auth-token": authToken.value,
      },
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
