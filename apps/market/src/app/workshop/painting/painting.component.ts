import { Component, ChangeDetectionStrategy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@locart/auth';
import { MediaService } from '@locart/media/upload';
import { Image, Painting, paintingSizes, paintingStyles, paintingTypes } from '@locart/model';
import { PaintingService } from '@locart/painting';
import { FormEntity, FormList, trackByIndex } from '@locart/utils';
import type { FormComponent } from '@locart/ui/confirm';

class FormPainting extends FormEntity<Painting> {
  constructor() {
    super({
      image: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      description: new FormControl(),
      carousel: new FormList<Image>(),
      size: new FormControl(null, Validators.required),
      style: new FormControl([]),
      type: new FormControl([]),
    })
  }

  get carousel() {
    return this.get('carousel') as FormList<Image>;
  }
}

@Component({
  selector: 'la-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingComponent implements OnInit, FormComponent {
  private id = this.route.snapshot.paramMap.get('paintingId')!;
  private uid = this.auth.user!.uid;
  private current?: Painting;

  form = new FormPainting();
  readonly sizes = paintingSizes;
  readonly styles = paintingStyles;
  readonly types = paintingTypes;

  title?: string

  @ViewChild('success') success!: TemplateRef<unknown>;
  @ViewChild('removed') removed!: TemplateRef<unknown>;

  trackByIndex = trackByIndex;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private service: PaintingService,
    private mediaService: MediaService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  get isCreateForm() {
    return this.id === 'create';
  }

  async ngOnInit() {
    if (this.isCreateForm) return;
    this.current = await this.service.load(this.id);
    this.form.reset(this.current);
    this.title = this.current?.title
  }

  reset() {
    (this.form.untouched)
      ? this.router.navigate(['../..'], { relativeTo: this.route })
      : this.form.reset(this.current);
  }

  async save() {
    if (this.form.invalid) return this.form.markAsTouched();
    const content = { owner: this.uid, ...this.form.value };
    await this.mediaService.uploadFiles();
    if (this.isCreateForm) {
      await this.service.add(content);
    } else {
      await this.service.update(this.id, content);
    }
    this.form.markAsPristine();
    this.snackbar.openFromTemplate(this.success, { duration: 3000 });
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  async remove() {
    if (this.isCreateForm) return;
    await this.service.remove(this.id);
    this.form.markAsPristine();
    this.snackbar.openFromTemplate(this.removed, { duration: 3000 });
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
