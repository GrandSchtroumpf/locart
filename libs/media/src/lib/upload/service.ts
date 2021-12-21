import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Inject, Injectable, Injector } from '@angular/core';
import { UploadMedia, FileMetadata } from '@locart/model';
import { UploadWidgetComponent } from './upload-widget/upload-widget.component';
import { FireStorage, FIREBASE_APP } from 'ngfire';
import { deleteObject, uploadBytesResumable, UploadTask, updateMetadata, FullMetadata, getStorage, ref, connectStorageEmulator } from 'firebase/storage';
import { FirebaseApp } from 'firebase/app';

function getRef(app: FirebaseApp, url: string) {
  const storage = getStorage(app, 'upload-bucket');
  connectStorageEmulator(storage, 'localhost', 9199);
  return ref(storage, url);
}

@Injectable()
export class MediaService {
  // Files to upload
  private overlayRef: OverlayRef | null = null;
  private tasks: (UploadTask | Promise<FullMetadata>)[] = [];
  uploading: string[] = [];
  queue: Record<string, UploadMedia<any> | null> = {};

  constructor(
    @Inject(FIREBASE_APP) private app: FirebaseApp,
    private storage: FireStorage,
    private overlay: Overlay,
  ) {}

  private attachWidget() {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay.position().global().bottom('16px').left('16px');
    this.overlayRef = this.overlay.create({ width: '300px', positionStrategy });
    const widget = new ComponentPortal(UploadWidgetComponent);
    const providers = [{ provide: 'tasks', useValue: this.tasks }];
    widget.injector = Injector.create({ providers });
    this.overlayRef.attach(widget);
  }

  private detachWidget() {
    if (!this.overlayRef) return;
    this.overlayRef.detach();
    this.overlayRef = null;
    this.tasks = [];

    // TODO: implement this if there are many upload possible
    // const canClose = this.tasks.every(task => {
    //   const state = task.task.snapshot.state as UploadState;
    //   return state === 'success' || state === 'canceled';
    // });
  }

  setPath<T>(path: string, uploadFile: UploadMedia<T> | null) {
    this.queue[path] = uploadFile;
  }

  setMeta<T extends FileMetadata>(path: string, meta: Partial<T>) {
    if (this.queue[path]) {
      this.queue[path]!.meta = { ...this.queue[path]!.meta, ...meta };
    } else {
      this.queue[path] = { meta };
    }
  }

  removePath(path: string) {
    if (path in this.queue) {
      delete this.queue[path];
    } else {
      this.queue[path] = null;
    }
  }

  isUploading(path: string) {
    return this.uploading.some((fullPath) => {
      const [uid, folder, filename] = fullPath.split('/');
      return path === folder;
    });
  }

  async upload() {
    this.uploading = [];
    for (const [path, media] of Object.entries(this.queue)) {
      const ref = getRef(this.app, path) // this.storage.ref(path);
      if (media === null) {
        deleteObject(ref);
      } else if (!media.file) {
        const task = updateMetadata(ref, { customMetadata: media.meta });
        this.tasks.push(task);
      } else {
        this.uploading.push(path);
        const task = uploadBytesResumable(ref, media.file, { customMetadata: media.meta });
        this.tasks.push(task);
      }
    }

    this.attachWidget();
    // Prevent Promise.all to fails
    const tasks = this.tasks.map((task) => task.catch((err) => console.error(err)));
    await Promise.all(tasks);
    // TODO: throw if all failed
    this.detachWidget();
    this.queue = {};
    this.uploading = []; // TODO: remove uploading keys one by one
  }
}
