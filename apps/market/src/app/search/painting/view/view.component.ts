import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaintingService } from '@locart/painting';

@Component({
  selector: 'la-painting-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingViewComponent {
  id = this.routes.snapshot.paramMap.get('paintingId');
  painting$ = this.service.valueChanges(this.id);

  constructor(
    private service: PaintingService,
    private routes: ActivatedRoute,
  ) {}


}
