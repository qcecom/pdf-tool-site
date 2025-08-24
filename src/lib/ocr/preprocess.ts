export function enhanceImageData(img: ImageBitmap): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d', { alpha: false })!;
  ctx.drawImage(img, 0, 0);
  const id = ctx.getImageData(0, 0, c.width, c.height);
  let sum = 0;
  for (let i = 0; i < id.data.length; i += 4) {
    const g =
      0.299 * id.data[i] + 0.587 * id.data[i + 1] + 0.114 * id.data[i + 2];
    id.data[i] = id.data[i + 1] = id.data[i + 2] = g;
    sum += g;
  }
  const mean = sum / (id.data.length / 4);
  const t = Math.min(200, Math.max(90, mean));
  for (let i = 0; i < id.data.length; i += 4) {
    const v = id.data[i] > t ? 255 : 0;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
  }
  ctx.putImageData(id, 0, 0);
  return c;
}
