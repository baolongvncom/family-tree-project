// composables/CompressImage.js

export async function compressImage(file, quality = 0.6, maxWidth = 1024) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File Invalid"));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Cannot compress Image!"));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error("Error while Reading Image!"));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error("Cannot read File!"));
    reader.readAsDataURL(file);
  });
}
