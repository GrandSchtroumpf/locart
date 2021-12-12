import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { BehaviorSubject } from 'rxjs';
import { MediaService } from '../service';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AuthService } from '@locart/auth';
import { getFilename, Image, ImageMetadata, imgixRect } from '@model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

type ImgState = 'loading' | 'idle' | 'hover' | 'cropping' | 'uploading' | 'selected';

export const acceptTypes = ['image/jpeg', 'image/png', 'image/webp'];


function createImg(img: Partial<Image> = {}) {
  return {
    path: img.path || null,
    title: img.title || null,
    rect: img.rect || null,
  };
}

@Component({
  selector: 'img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImgUploadValueAccessor),
    multi: true,
  },
  {
    provide: TRANSLOCO_SCOPE,
    useValue: 'media',
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgUploadValueAccessor implements ControlValueAccessor {

  private state = new BehaviorSubject<ImgState>('loading');
  private cropperRef?: MatDialogRef<any, void>;
  private hasNewFile = false;

  /** Initial value provided by the parent form to reset meta if file is uploaded */
  private initial: Image = createImg();

  /** Current image data */
  img: Image = createImg();
  /** Raw file uploaded by the user */
  rawFile?: File;
  /** Cropped version of the image */
  base64 = '';
  /** Accepted types */
  types = acceptTypes.join();
  state$ = this.state.asObservable();

  @ViewChild('cropperDialog') cropperDialog!: TemplateRef<unknown>;
  @ViewChild(ImageCropperComponent) cropper?: ImageCropperComponent;
  @Input() path = '';
  @Input() field = 'image';
  @Input() ratio: number = 1 / 1;
  @Input() orginalFile?: File;
  @Input() preview = '';
  @Output() previewChange = new EventEmitter<string>();
  @Output() orginalFileChange = new EventEmitter<File>();
  @Output() change = new EventEmitter<Image | null>();
  @Output() delete = new EventEmitter();

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

  constructor(
    private auth: AuthService,
    private service: MediaService,
    private dialog: MatDialog
  ) {}

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
    input.value = "";
  }

  readFile(file?: File | null) {
    if (file) {
      if (file.type.includes('image')) {
        this.rawFile = file;
        this.openCropper();
      } else {
        throw new Error('Unsupported type: ' + file.type);
      }
    }
  }

  //////////
  // CROP //
  //////////

  openCropper() {
    this.cropperRef = this.dialog.open(this.cropperDialog, { maxHeight: '80vh', maxWidth: '80vw' });
  }

  cancelCrop() {
    // TODO: Check what happens if you cancel crop after uploading before saving
    if (!this.hasNewFile) delete this.rawFile;
    this.setState();
    this.cropperRef?.close();
  }

  async crop(cropper: ImageCropperComponent) {
    const cropped = cropper?.crop();
    this.cropperRef?.close();
    if (cropped && cropped.base64) {
      this.base64 = cropped.base64;
      this.img.rect = imgixRect(cropped.imagePosition);
      if (!this.hasNewFile && this.rawFile) {
        this.hasNewFile = true;
        this.add(this.rawFile);
        this.orginalFileChange.emit(this.rawFile);
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
    this.base64 = '';
    // Upadate the form with new value now
    this.hasNewFile = false;
    this.ontouch();
    this.onchange();
    this.setState('idle');
    this.delete.emit(); // Need to trigger this after onChange to avoid side effects
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

    this.base64 = '';
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
      fn(img);
      this.change.next(img);
      this.previewChange.emit(this.base64);
    };
  }

  registerOnTouched(fn: () => void): void {
    this.ontouch = fn;
  }
}
