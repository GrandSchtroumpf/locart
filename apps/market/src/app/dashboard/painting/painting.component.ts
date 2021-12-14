import { Component, ChangeDetectionStrategy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@locart/auth';
import { MediaService } from '@locart/media/upload';
import { Painting, paintingSizes } from '@locart/model';
import { PaintingService } from '@locart/painting';
import { FormEntity, FormList, trackByIndex } from '@locart/utils';
import type { FormComponent } from '@locart/ui/confirm';

class FormPainting extends FormEntity<Painting> {
  constructor() {
    super({
      image: new FormControl(),
      name: new FormControl(),
      carousel: new FormList<string>(),
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
  @ViewChild('confirm') confirm!: TemplateRef<unknown>;
  @ViewChild('success') success!: TemplateRef<unknown>;
  uid = this.auth.user!.uid;
  id = this.routes.snapshot.paramMap.get('paintingId')!;
  current?: Painting;
  form = new FormPainting();

  sizes = paintingSizes;

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

  async ngOnInit() {
    if (this.id === 'create') return;
    this.current = await this.service.load(this.id, { userId: this.uid });
    this.form.reset(this.current);
  }

  reset() {
    (this.form.untouched)
      ? this.router.navigate(['../..'], { relativeTo: this.routes })
      : this.form.reset(this.current);
  }

  async save() {
    if (this.form.invalid) this.form.markAsTouched();
    const params = { userId: this.uid };
    await this.mediaService.upload();
    if (this.id === 'create') {
      await this.service.add(this.form.value, { params });
    } else {
      await this.service.update(this.id, this.form.value, { params });
    }
    this.form.markAsPristine();
    this.snackbar.openFromTemplate(this.success, { duration: 3000 });
    this.router.navigate(['../..'], { relativeTo: this.routes });
  }
}
