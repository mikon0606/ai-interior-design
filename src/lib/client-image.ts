const MAX_IMAGE_EDGE = 1800;
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESSION_BYTES = 1.2 * 1024 * 1024;

export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SKIP_COMPRESSION_BYTES) {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });

  if (!blob || blob.size >= file.size) return file;

  const filename = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${filename}.jpg`, { type: "image/jpeg" });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片读取失败"));
    };
    image.src = url;
  });
}
