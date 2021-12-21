export type UploadState = 'success' | 'paused' | 'running' | 'canceled';
export interface UploadMedia<T> {
  file?: Blob;
  meta: T;
}

export interface FileMetadata {
  uid: string;
  field: string;
  title: string | null;
}

export interface ImageMetadata extends FileMetadata {
  rect: string | null;
}

export type UploadImage = UploadMedia<ImageMetadata>;


export interface Image {
  path: string | null;
  rect: string | null;
  title: string | null;
}

export interface FileStorage {
  path: string;
  title: string;
  url: string;
}

function getScrsetWidths(from: number, to: number, step: number) {
  const widths: number[] = [];
  for (let w = from; w < to; w += step) {
    widths.push(w)
  }
  return widths;
}
export const srcsetWidths = getScrsetWidths(40, 1000, 120);