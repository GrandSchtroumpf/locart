import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaintingService } from '@locart/painting';
import { Painting, Rent, Duration } from '@locart/model';
import { DurationForm, filterDates, RentService } from '@locart/rent';
import { AuthService } from '@locart/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { orderBy, startAt, where } from 'firebase/firestore';
import { map, tap } from 'rxjs/operators';
import { ValidatorFn } from '@angular/forms';
import { addWeeks } from 'date-fns'

function inDuration({ from, to }: Duration, time: Date): boolean {
  return (from < time && to > time);
}

function rentValidator(rents: Rent[]): ValidatorFn {
  return (control) => {
    const { from } = control.parent!.value as Duration; // value 'to' is not forwarded to the parent until validator returns
    const to = control.value as Date;
    if (!from || !to) return null;
    const coverRent = rents.find(rent => {
      if (inDuration({ from, to }, rent.duration.from)) return true;
      if (inDuration({ from, to }, rent.duration.to)) return true;
      return false;
    })
    return coverRent ? { coverRent } : null;
  }
}

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
  startDate = addWeeks(new Date(), 1);

  form = new DurationForm();

  filters$ = this.rentService.valueChanges([
    where('workId', '==', this.id),
    orderBy('duration.to', 'asc'),
    startAt(new Date())
  ]).pipe(
    tap(rents => this.form.get('to')!.addValidators(rentValidator(rents))),
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

}
