import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  id = this.route.snapshot.paramMap.get('paintingId');
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
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  async rent(painting: Painting) {
    const email = this.auth.user?.email;
    const range = this.form.value;
    if (this.form.invalid) return this.form.markAsTouched(); // stocking and reseting form value prior to calling the service prevents the datepick to display text in red
    if (this.form.valid) this.form.reset();
    if (!email) return alert('Vous devez être connecté');
    await this.rentService.add({
      email,
      duration: range,
      type: 'painting',
      workId: painting.id,
    });
    this.snackbar.openFromTemplate(this.success, { duration: 3000 });
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async test() {
    let start = new Date
    let end = new Date
    const date = new Date
    const a = await this.rentService.load('kWgyuzrZTj93ueoW53XB').then(m => {
      start = m!.duration.from;
      end = m!.duration.to;
    })
    if ( date.getTime() > start.getTime() || date.getTime() < end.getTime() ) console.log('not included')
  }

}
