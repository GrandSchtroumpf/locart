
import { Pipe, PipeTransform } from '@angular/core';
import { getBlob } from 'firebase/storage';
import { MediaService } from './service';

@Pipe({ name: 'getBlob' })
export class GetBlobPipe implements PipeTransform {
  constructor(private media: MediaService) {}
  transform(path: string) {
    return getBlob(this.media.ref(path));
  }
}
