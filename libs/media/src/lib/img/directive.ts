import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Image } from '@locart/model';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getImgIxUrl } from './imgix';
import { cropImg } from './crop';
import { FireStorage } from 'ngfire';
import { getDownloadURL } from 'firebase/storage';
import env from '@env';

const extensions = ['webp', 'svg', 'jpeg', 'jpg', 'png'];

function hasExtension(assetId: string) {
  const ext = assetId.split('.').pop();
  return ext && extensions.includes(ext);
}

function getImg(img: Image | string | undefined | null) {
  if (!img) return img;
  if (typeof img === 'string') return getImgIxUrl(img, { fit: 'max', auto: ['compress', 'format'] });
  return getImgIxUrl(img.path, { fit: 'max', auto: ['compress', 'format'], rect: img.rect });
}

function getImgStorage(img: Image | string | undefined | null) {
  if (!img) return img;
  if (typeof img === 'string') return getImgIxUrl(img, { fit: 'max', auto: ['compress', 'format'] });
  if (!img.path) return img;
  const path = img.path.split('/').join('%2F');
  const prefix = 'http://localhost:9199/v0/b/default-bucket/o';
  const queryParams = 'alt=media';
  return `${prefix}/${path}?${queryParams}`;
}

function hasImageDiff(
  a: Image | string | undefined | null,
  b: Image | string | undefined | null,
) {
  if (!a && !b) return false;
  if (!a || !b) return true;
  if (typeof a !== typeof b) return true;
  if (typeof a === 'string' || typeof b === 'string') return a !== b;
  return a.path !== b.rect || a.path !== b.path;
}


@Directive({ selector: 'img[path], img[asset]' })
export class ImgDirective implements OnInit, OnDestroy {
  private sub?: Subscription;
  private pathId = new BehaviorSubject<Image | string | undefined | null>(null);
  private assetId = new BehaviorSubject<string | null>('');
  private hasError = new BehaviorSubject(false);
  private urls: Record<string, string> = {};
  @HostBinding() src?: string;
  @HostBinding() srcset?: string;

  @HostListener('error')
  onError() {
    if (!this.hasError.getValue()) {
      this.hasError.next(true);
    }
  }

  @Input() set path(pathId: Image | string | undefined | null) {
    if (hasImageDiff(this.pathId.getValue(), pathId)) {
      this.pathId.next(pathId);
    }
  }

  @Input() set asset(assetId: string | null) {
    if (assetId && this.assetId.getValue() !== assetId) {
      this.assetId.next(assetId);
    }
  }

  constructor(
    private storage: FireStorage,
    private cdr: ChangeDetectorRef,
  ) {}

  get extension() {
    return 'svg';
  }

  ngOnInit() {
    this.sub = combineLatest([
      this.getMedia(),
      this.assetId.pipe(map((assetId) => this.fromAsset(assetId))),
      this.hasError.asObservable(),
    ]).subscribe(([media, asset, hasError]) => {
      if (hasError) {
        this.src = asset;
        this.srcset = undefined;
      } else {
        this.src = (media || asset) as string;
        // this.srcset = media ? getSrcset(media) : '';
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  fromAsset(assetId: string | null) {
    if (!assetId) return;
    return hasExtension(assetId)
      ? `assets/img/${assetId}`
      : `assets/img/${assetId}.${this.extension}`; // not used
  }

  // If we use the emulator mock imgix
  private getMedia() {
    return env.useEmulators
      ? this.pathId.pipe(map(getImgStorage))
      : this.pathId.pipe(map(getImg))
  }

  private async getImg(img: string | Image | null | undefined) {
    if (!img) return img;
    if (typeof img === 'string') return img;
    if (!img.path || !img.rect) return '';
    if (!this.urls[img.path]) {
      const ref = this.storage.ref(img.path);
      this.urls[img.path] = await getDownloadURL(ref);
    }
    return cropImg(this.urls[img.path], img.rect);
  }
}


@NgModule({
  declarations: [ImgDirective],
  exports: [ImgDirective],
})
export class ImgModule {}
