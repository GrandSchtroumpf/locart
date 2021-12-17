import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaintingService } from '@locart/painting';
import { Painting } from '@locart/model';
import { DurationForm, filterDates, RentService } from '@locart/rent';
import { AuthService } from '@locart/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { orderBy, startAt, where } from 'firebase/firestore';
import { map } from 'rxjs/operators';



@Component({
  selector: 'la-painting-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingViewComponent {
  @ViewChild('success') success!: TemplateRef<unknown>;
  id = this.routes.snapshot.paramMap.get('paintingId');
  painting$ = this.service.valueChanges(this.id);
  
  form = new DurationForm();

  filters$ = this.rentService.valueChanges([
    where('workId', '==', this.id),
    orderBy('duration.to', 'asc'),
    startAt(new Date())
  ]).pipe(
    map(filterDates)
  )

  constructor(
    private auth: AuthService,
    private service: PaintingService,
    private rentService: RentService,
    private routes: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {}

  async rent(painting: Painting) {
    const email = this.auth.user?.email;
    if (!email) return alert('Vous devez être connecté');
    await this.rentService.add({
      email,
      duration: this.form.value,
      type: 'painting',
      workId: painting.id,
    });
    this.snackbar.openFromTemplate(this.success, { duration: 3000 });
  }

}
