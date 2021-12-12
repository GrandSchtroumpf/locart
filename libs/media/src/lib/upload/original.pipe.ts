
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { FireStorage } from '@ngfire/storage';
import { getDownloadURL } from 'firebase/storage';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import env from '@env';

@Pipe({ name: 'original' })
export class GetOriginalPipe implements PipeTransform {
  constructor(
    private storage: FireStorage,
    private http: HttpClient,
  ) {}
  transform(path: string) {
    return from(this.getUrl(path)).pipe(
      switchMap(url => this.http.get(url, { responseType: 'blob' })),
    );
  }

  private getUrl(path: string) {
    if (env.useEmulators) {
      const ref = this.storage.ref(path);
      return getDownloadURL(ref);
    } else {
      const imgixSource = env.firebaseConfig.options.projectId;
      return `https://${imgixSource}.imgix.net/${path}`;
    }
  }
}
