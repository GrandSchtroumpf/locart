import { getRect } from "../utils";

const cache: Record<string, string> = {};

export function cropImg(url: string, rect: string): Promise<string> {
  const id = `${url}_${rect}`;
  if (cache[id]) return Promise.resolve(cache[id]);
  const { x, y, width, height } = getRect(rect);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve('');
  const image = new Image();
  image.src = url;
  image.crossOrigin = 'Anonymous';
  return new Promise((res) => {
    image.onload = () => {
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
      const result = canvas.toDataURL();
      cache[id] = result;
      res(result);
    };
  })
  
}