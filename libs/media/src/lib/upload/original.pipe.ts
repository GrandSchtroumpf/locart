
import { Pipe, PipeTransform } from '@angular/core';
import { FireStorage } from 'ngfire';
import { getDownloadURL } from 'firebase/storage';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import env from '@env';

@Pipe({ name: 'original' })
export class GetOriginalPipe implements PipeTransform {
  constructor(private storage: FireStorage) {}
  transform(path: string) {
    return from(this.getUrl(path)).pipe(
      switchMap(url => fetch(url).then(res => res.blob()))
    );
  }

  private getUrl(path: string) {
    if (env.useEmulators) {
      const ref = this.storage.ref(path);
      return getDownloadURL(ref);
    } else {
      const imgixSource = env.firebase.options.projectId;
      return `https://${imgixSource}.imgix.net/${path}`;
    }
  }
}
