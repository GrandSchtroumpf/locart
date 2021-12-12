import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@locart/auth';
import { MediaService } from '../service';
import { ImageMetadata } from '@locart/model';
import { imgixRect, getFilename } from '../../utils'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { fade } from '@locart/utils';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { acceptTypes, ImgUploadValueAccessor } from '../img-upload/img-upload.component';

@Component({
  selector: 'list-img-upload',
  templateUrl: './list-img-upload.component.html',
  styleUrls: ['./list-img-upload.component.scss'],
  animations: [fade],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'media',
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListImgUploadComponent {
  @ViewChild('cropperDialog') cropperDialog?: TemplateRef<unknown>;
  @ViewChild(ImageCropperComponent) cropper?: ImageCropperComponent;
  @ViewChild(ImgUploadValueAccessor) uploader?: ImgUploadValueAccessor;
  @Input() form = new FormArray([]);
  @Input() path!: string;
  @Input() field!: string;
  @Input() ratio: number = 4/3;
  currentIndex = -1
  files: File[] = [];
  preview: string[] = [];
  types = acceptTypes.join();

  constructor(
    private service: MediaService,
    private auth: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}
  
  get control() {
    if (this.currentIndex < 0) return null;
    return this.form.at(this.currentIndex) as FormControl;
  }

  select(index: number) {
    this.currentIndex = index;
  }
  
  remove(index: number) {
    this.preview.splice(index, 1);
    this.form.removeAt(index);
    this.currentIndex = -1;
  }

  reset() {
    this.preview = [];
  }

  openCropper(event: Event) {
    if (!this.cropperDialog) return;
    if (event.target instanceof HTMLInputElement) {
      const file = event.target.files?.item(0);
      if (!file) return;
      const index = this.form.value.length;
      this.files[index] = file;
      this.dialog.open(this.cropperDialog, { data: file, maxHeight: '80vh', maxWidth: '80vw' });
    }
  }

  crop() {
    const index = this.form.value.length;
    const user = this.auth.user;
    const file = this.files[index];
    const event = this.cropper?.crop();
    if (!file || !user || !event?.base64) return;
    const img = {
      path: `${user.uid}/${this.path}/${file.name}`,
      rect: imgixRect(event.imagePosition),
      title: getFilename(file),
    };
    const control = new FormControl(img);
    const meta: ImageMetadata = {
      rect: img.rect,
      title: img.title,
      field: `${this.field}/${index}`,
      uid: user.uid,
    };
    this.form.push(control);
    this.preview[index] = event.base64;
    this.service.setPath(img.path, { file, meta });
    this.select(index);
    this.form.markAsTouched();
    this.form.markAsDirty();
    this.cdr.markForCheck();
  }
}
