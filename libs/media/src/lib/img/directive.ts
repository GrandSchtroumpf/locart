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
import { Image, srcsetWidths } from '@locart/model';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getImgUrl } from '../utils';

const extensions = ['webp', 'svg', 'jpeg', 'jpg', 'png'];

function hasExtension(assetId: string) {
  const ext = assetId.split('.').pop();
  return ext && extensions.includes(ext);
}




function getImgStorage(img: Image | undefined | null) {
  if (!img) return null;
  if (typeof img === 'string') return null;
  if (!img.path) return null;
  const src = getImgUrl(img);
  const srcset = srcsetWidths.map(w => `${getImgUrl(img, w)} ${w}w`).join();
  return { src, srcset };
}

function hasImageDiff(
  a: Image | undefined | null,
  b: Image | undefined | null,
) {
  if (!a && !b) return false;
  if (!a || !b) return true;
  if (typeof a !== typeof b) return true;
  return a.path !== b.rect || a.path !== b.path;
}


@Directive({ selector: 'img[path], img[asset]' })
export class ImgDirective implements OnInit, OnDestroy {
  private sub?: Subscription;
  private pathId = new BehaviorSubject<Image | undefined | null>(null);
  private assetId = new BehaviorSubject<string | null>('');
  private hasError = new BehaviorSubject(false);
  private maxRetry = 5;
  private lastTry = 0;
  @HostBinding() src?: string;
  @HostBinding() srcset?: string;

  @HostListener('error')
  onError() {
    if (!this.hasError.getValue()) {
      this.retry();
    }
  }

  @Input() set path(pathId: Image | undefined | null) {
    if (hasImageDiff(this.pathId.getValue(), pathId)) {
      this.pathId.next(pathId);
    }
  }

  @Input() set asset(assetId: string | null) {
    if (assetId && this.assetId.getValue() !== assetId) {
      this.assetId.next(assetId);
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}

  get extension() {
    return 'svg';
  }

  ngOnInit() {
    this.sub = combineLatest([
      this.pathId.pipe(map(getImgStorage)),
      this.assetId.pipe(map((assetId) => this.fromAsset(assetId))),
      this.hasError.asObservable(),
    ]).subscribe(([media, asset, hasError]) => {
      if (hasError) {
        this.src = asset;
        this.srcset = undefined;
      } else {
        this.src = (media?.src || asset) as string;
        this.srcset = media?.srcset || '';
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
      : `assets/img/${assetId}.${this.extension}`;
  }

  private retry() {
    // srcet might triggers multiple errors at the same time. Prevent that
    if (this.lastTry && (performance.now() - this.lastTry) < 500) return;
    this.lastTry = performance.now();
    this.src = this.fromAsset(this.assetId.getValue());
    this.srcset = '';
    setTimeout(() => {
      if (!this.maxRetry) return this.hasError.next(true);
      this.maxRetry -= 1;
      this.pathId.next(this.pathId.getValue());
    }, 500);
  }
}


@NgModule({
  declarations: [ImgDirective],
  exports: [ImgDirective],
})
export class ImgModule {}
