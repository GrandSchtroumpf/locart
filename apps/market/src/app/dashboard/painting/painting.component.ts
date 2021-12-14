import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Painting } from '@locart/model';
import { PaintingService } from '@locart/painting';

class FormPainting extends FormGroup {
  constructor() {
    super({
      image: new FormControl(),
      name: new FormControl(),
      carousel: new FormArray([]),
    })
  }

  get carousel() {
    return this.get('carousel') as FormArray;
  }

  reset(painting: Partial<Painting> = {}) {
    this.carousel.clear();
    super.reset(painting);
    painting.carousel?.forEach(img => this.carousel.push(new FormControl(img)));
  }
}

@Component({
  selector: 'la-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingComponent implements OnInit {
  id = this.routes.snapshot.paramMap.get('paintingId')!;
  current?: Painting;
  form = new FormPainting();

  constructor(
    private routes: ActivatedRoute,
    private router: Router,
    private service: PaintingService,
  ) {}

  async ngOnInit() {
    this.current = await this.service.load(this.id);
    this.reset();
  }

  reset() {
    this.id === 'create'
      ? this.router.navigate(['..'], { relativeTo: this.routes })
      : this.form.reset(this.current);
  }

  save() {
    if (this.form.invalid) this.form.markAsTouched();
  }
}
