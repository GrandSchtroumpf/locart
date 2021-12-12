import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GetOriginalPipe } from './original.pipe';
import { ImgUploadValueAccessor } from './img-upload/img-upload.component';
import {
  UploadWidgetComponent,
  TaskProgressPipe,
  TaskHasStatePipe,
} from './upload-widget/upload-widget.component';
import { ListImgUploadComponent } from './list-img-upload/list-img-upload.component';
import { FileUploadValueAccessor } from './file-upload/file-upload.component';

import { ImageCropperModule } from 'ngx-image-cropper';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MediaService } from './service';
import { ImgModule } from '../img';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ImgUploadValueAccessor,
    UploadWidgetComponent,
    GetOriginalPipe,
    TaskProgressPipe,
    TaskHasStatePipe,
    ListImgUploadComponent,
    FileUploadValueAccessor
  ],
  exports: [ImgUploadValueAccessor, UploadWidgetComponent, ListImgUploadComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    ImageCropperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDialogModule,
    ImgModule,
  ],
  providers: [MediaService],
})
export class MediaModule {}
