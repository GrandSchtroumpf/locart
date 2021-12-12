import env from '@env';
type ImgixAuto = 'compress' | 'enhance' | 'format' | 'redeye';
type ImgixFit =
  | 'clamp'
  | 'clip'
  | 'crop'
  | 'facearea'
  | 'fill'
  | 'fillmax'
  | 'max'
  | 'min'
  | 'scale';

/**
 * Interface that hold the image options for imgix processing.
 * @note the key names has to be exactly the same as in the imgix api !
 */
export interface ImageParameters {
  /** automatic optimization : https://docs.imgix.com/apis/url/auto/auto */
  auto?: ImgixAuto | ImgixAuto[];
  /** resize behavior : https://docs.imgix.com/apis/url/size/fit */
  fit?: ImgixFit;
  /** image width : https://docs.imgix.com/apis/url/size/w */
  w?: number;
  /** image height : https://docs.imgix.com/apis/url/size/h */
  h?: number;
  /** security token : https://github.com/imgix/imgix-blueprint#securing-urls */
  s?: string;
  /** PDF page to display : https://docs.imgix.com/apis/rendering/pdf/page */
  page?: number;
  /** Crop of the image https://docs.imgix.com/apis/rendering/size/rect */
  rect?: string | null;
}

export function getSrcset(url: string) {
  // If base64 return empty string
  if (url.startsWith('data:')) return '';
  const sizes: string[] = [];
  for (let w = 40; w < 500; w = w+40) {
    sizes.push(`${url}&w=${w} ${w}w`);
  }
  return sizes.join();
}

/**
 * Transform an `ImageParameters` object into the query string part of an url, ready to sent to imgix.
 * @example
 * const param: ImageParameters = {
 *   fit: 'crop',
 *   w: 100,
 *   h: 100
 * };
 * formatParameters(param); // 'fit=crop&w=100&h=100&'
 */
export function formatParameters(parameters: ImageParameters = {}): string {
  const query = Object.entries(parameters)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => {
      return Array.isArray(value) ? `${key}=${value.join()}` : `${key}=${value}`;
    })
    .join('&');

  return query;
}

/**
 * getImgIxResourceUrl : Generate ImgIx resource URL
 * @param path The path of the image in imgix
 * @param parameters Query params for the image
 */
export function getImgIxUrl(path?: string | null, parameters?: ImageParameters) {
  if (!path) return '';
  const query = formatParameters(parameters);
  const imgixSource = env.firebase.options.projectId;
  const encodedPath = encodeURI(path);
  return `https://${imgixSource}.imgix.net/${encodedPath}?${query}`;
}

export function createImgIxUrl(path: string, parameters: ImageParameters = {}): string {
  if (!path) return '';
  path = encodeURI(path); // For accentuated files names
  return getImgIxUrl(path, parameters);
}
