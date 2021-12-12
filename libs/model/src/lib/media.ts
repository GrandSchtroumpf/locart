export type UploadState = 'success' | 'paused' | 'running' | 'canceled';
export interface UploadMedia<T> {
  file: Blob;
  /** @deprecated use meta.field instead */
  field?: string;
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