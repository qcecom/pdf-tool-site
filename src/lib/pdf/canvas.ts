export async function imageBitmapFromBytes(bytes: Uint8Array): Promise<ImageBitmap> {
  const blob = new Blob([bytes]);
  return await createImageBitmap(blob);
}

export async function downscaleToJpeg(
  img: ImageBitmap,
  scale = 0.7,
  quality = 0.7
): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d', { alpha: false })!;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((r) =>
    canvas.toBlob((b) => r(b!), 'image/jpeg', quality)
  );
  return new Uint8Array(await blob.arrayBuffer());
}
