import { Image, ImageMetadata } from "@locart/model";
import { UploadTask, UploadTaskSnapshot } from "firebase/storage";
import type { CropperPosition } from "ngx-image-cropper";
import { debounceTime, map, Observable } from "rxjs";

export function imgUpdate(path: string, meta: ImageMetadata): Image {
  return { path, rect: meta.rect, title: meta.title };
}

export function getRect(rect: string) {
  const [x, y, width, height] = rect.split(',').map(value => parseInt(value.trim(), 10));
  return { x, y, width, height };
}

export function getFilename(file: File) {
  const segments = file.name.split('.');
  segments.pop(); // extension
  return segments.join('.');
}

export function imgixRect({ x1, x2, y1, y2 }: CropperPosition) {
  return `${x1},${y1},${x2 - x1},${y2 - y1}`;
}


export function fromTask(
  task: UploadTask,
): Observable<UploadTaskSnapshot> {
return new Observable<UploadTaskSnapshot>((subscriber) => {
  const progress = (snap: UploadTaskSnapshot): void => subscriber.next(snap);
  const error = (e: Error): void => subscriber.error(e);
  const complete = (): void => subscriber.complete();
  progress(task.snapshot);
  const unsubscribe = task.on('state_changed', progress);
  task.then(
      (snapshot) => {
        progress(snapshot);
        setTimeout(() => complete(), 0);
      },
      (e) => {
        progress(task.snapshot);
        setTimeout(() => error(e), 0);
      },
  );
  return () => unsubscribe();
}).pipe(
    // since we're emitting first the current snapshot and then progression
    // it's possible that we could double fire synchronously; namely when in
    // a terminal state (success, error, canceled). Debounce to address.
    debounceTime(0),
);
}

interface TaskProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

export function percentage(task: UploadTask): Observable<TaskProgress> {
  return fromTask(task).pipe(
    map((snapshot) => ({
      progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      snapshot,
    })
  ),
);
}