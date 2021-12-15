import { Component, ChangeDetectionStrategy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@locart/auth';
import { MediaService } from '@locart/media/upload';
import { Painting, paintingSizes, paintingStyles, paintingTypes } from '@locart/model';
import { PaintingService } from '@locart/painting';
import { FormEntity, FormList, trackByIndex } from '@locart/utils';
import type { FormComponent } from '@locart/ui/confirm';

class FormPainting extends FormEntity<Painting> {
  constructor() {
    super({
      image: new FormControl(),
      title: new FormControl(),
      carousel: new FormList<string>(),
      size: new FormControl(),
      style: new FormControl(),
      type: new FormControl(),
    })
  }

  get carousel() {
    return this.get('carousel') as FormList<string>;
  }
}

@Component({
  selector: 'la-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingComponent implements OnInit, FormComponent {
  private id = this.routes.snapshot.paramMap.get('paintingId')!;
  private uid = this.auth.user!.uid;
  private current?: Painting;
  
  form = new FormPainting();
  readonly sizes = paintingSizes;
  readonly styles = paintingStyles;
  readonly types = paintingTypes;
  
  @ViewChild('success') success!: TemplateRef<unknown>;
  @ViewChild('removed') removed!: TemplateRef<unknown>;
  
  trackByIndex = trackByIndex;
  
  constructor(
    private routes: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private service: PaintingService,
    private mediaService: MediaService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  get isCreateForm() {
    return this.id === 'create';
  }

  async ngOnInit() {
    if (this.isCreateForm) return;
    // TODO: relove seems not to work. Check why
    this.current = await this.service.load(this.id, { userId: this.uid });
    this.form.reset(this.current);
  }

  reset() {
    (this.form.untouched)
      ? this.router.navigate(['../..'], { relativeTo: this.routes })
      : this.form.reset(this.current);
  }

  async save() {
    if (this.form.invalid) return this.form.markAsTouched();
    const params = { userId: this.uid };
    await this.mediaService.upload();
    if (this.isCreateForm) {
      await this.service.add(this.form.value, { params });
    } else {
      await this.service.update(this.id, this.form.value, { params });
    }
    this.form.markAsPristine();
    this.snackbar.openFromTemplate(this.success, { duration: 3000 });
    this.router.navigate(['../..'], { relativeTo: this.routes });
  }

  async remove() {
    if (this.isCreateForm) return;
    await this.service.remove(this.id);
    this.form.markAsPristine();
    this.snackbar.openFromTemplate(this.removed, { duration: 3000 });
    this.router.navigate(['../..'], { relativeTo: this.routes });
  }
}
