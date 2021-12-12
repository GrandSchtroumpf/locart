import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  Output,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CropperPosition, ImageCropperComponent } from 'ngx-image-cropper';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaService } from '../service';
import { animState } from '../animation';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AuthService } from '@locart/auth';
import { Image, ImageMetadata } from '@locart/model';
import env from '@env';

type ImgState = 'loading' | 'idle' | 'hover' | 'cropping' | 'uploading' | 'selected';

const types = ['image/jpeg', 'image/png', 'image/webp'];

function getFilename(file: File) {
  const segments = file.name.split('.');
  segments.pop(); // extension
  return segments.join('.');
}

function imgixRect({ x1, x2, y1, y2 }: CropperPosition) {
  return `${x1},${y1},${x2 - x1},${y2 - y1}`;
}

function createImg(img: Partial<Image> = {}) {
  return {
    path: img.path || null,
    title: img.title || null,
    rect: img.rect || null,
  };
}

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  animations: [animState],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadValueAccessor),
      multi: true,
    },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'media',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadValueAccessor implements ControlValueAccessor {
  private state = new BehaviorSubject<ImgState>('loading');
  private hasNewFile = false;

  /** Initial value provided by the parent form to reset meta if file is uploaded */
  private initial: Image = createImg();

  /** Current image data */
  img: Image = createImg();
  /** Raw file uploaded by the user */
  rawFile?: File;
  /** Cropped version of the image */
  base64?: string;
  /** Accepted types */
  types = types.join();

  percentage$?: Observable<number | undefined>;
  state$ = this.state.asObservable();

  @ViewChild(ImageCropperComponent) cropper?: ImageCropperComponent;
  @Input() path = '';
  @Input() field = 'image';
  @Input() ratio: number = 1 / 1;
  @Output() change = new EventEmitter<Image | null>();

  @HostBinding('@animState') get currentState() {
    return this.state.getValue();
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    $event.preventDefault();
    this.state.next('hover');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: DragEvent) {
    $event.preventDefault();
    this.setState(this.defaultState);
  }

  @HostListener('drop', ['$event'])
  async onDrop($event: DragEvent) {
    $event.preventDefault();
    this.readFile($event.dataTransfer?.files.item(0) || null);
  }

  private onchange = () => {};
  private ontouch = () => {};

  constructor(private auth: AuthService, private service: MediaService) {}

  get defaultState(): ImgState {
    return this.img.path ? 'selected' : 'idle';
  }

  setState(state?: ImgState) {
    this.state.next(state || this.defaultState);
  }

  //////////
  // IDLE //
  //////////

  file(event: Event) {
    const input = event.target as HTMLInputElement;
    this.readFile(input.files?.item(0));
  }

  readFile(file?: File | null) {
    if (file) {
      if (file.type.includes('image')) {
        this.rawFile = file;
        this.setState('cropping');
      } else {
        throw new Error('Unsupported type: ' + file.type);
      }
    }
  }

  //////////
  // CROP //
  //////////

  cancelCrop() {
    // TODO: Check what happens if you cancel crop after uploading before saving
    delete this.rawFile;
    this.setState();
  }

  async crop() {
    const cropped = this.cropper?.crop();
    if (cropped && cropped.base64) {
      this.base64 = cropped.base64;
      this.img.rect = imgixRect(cropped.imagePosition);
      if (!this.hasNewFile && this.rawFile) {
        this.hasNewFile = true;
        this.add(this.rawFile);
      } else {
        this.setState('selected');
        this.ontouch();
        this.onchange();
      }
    }
  }

  /** Add raw image to the upload queue */
  async add(file: File) {
    const user = this.auth.user;
    if (!user) {
      throw new Error('Only connected user should be able to upload files');
    }
    // Delete old reference if any
    const old = this.img.path;
    if (old) {
      this.service.setPath(old, null);
    }
    const path = `${user.uid}/${this.path}/${file.name}`;
    this.img.title = getFilename(file);
    this.img.path = path;
    const meta: ImageMetadata = {
      rect: this.img.rect,
      title: this.img.title,
      field: this.field,
      uid: user.uid,
    };
    this.service.setPath(path, { file, meta });
    this.ontouch();
    this.onchange();
    this.setState('selected');
  }

  //////////////
  // SELECTED //
  //////////////

  updateMeta() {
    const { rect, title, path } = this.img;
    const field = this.field;
    // TODO: Get Userid
    if (path) {
      this.service.setMeta<ImageMetadata>(path, { rect, title, field });
      this.onchange();
      this.ontouch();
    }
  }

  remove() {
    // Remove current path from queue
    if (this.img.path) {
      if (this.img.path === this.initial.path) {
        this.service.setPath(this.img.path, null);
      } else {
        this.service.removePath(this.img.path);
      }
    }
    this.img = createImg();
    // Upadte the form with new value now
    this.hasNewFile = false;
    this.ontouch();
    this.onchange();
    this.setState('idle');
  }

  //////////////////////////
  // ControlValueAccessor //
  //////////////////////////

  async writeValue(value: Image | null) {
    this.initial = createImg(value || {});
    this.hasNewFile = false;
    delete this.rawFile;

    // If parent form has been reset, we don't want to take action in the media service
    if (this.img.path) {
      this.service.removePath(this.img.path);
    }

    // If file is uploading, don't update UI
    if (this.service.isUploading(this.path)) return;

    delete this.base64;
    this.img = createImg(value || {});
    if (value?.path) {
      this.setState('selected');
    } else {
      this.setState('idle');
    }
  }

  registerOnChange(fn: (mediaId: Image | null) => void): void {
    this.onchange = () => {
      const img = this.img;
      this.hasNewFile ? fn(this.initial) : fn(img);
      this.change.next(img);
    };
  }

  registerOnTouched(fn: () => void): void {
    this.ontouch = fn;
  }
}

@Pipe({ name: 'original' })
export class GetOriginalPipe implements PipeTransform {
  transform(path: string) {
    const imgixSource = env.firebase.options.projectId;
    const url = `https://${imgixSource}.imgix.net/${path}`;
    return fetch(url).then(res => res.blob());
  }
}
