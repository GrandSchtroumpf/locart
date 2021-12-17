import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@locart/auth';
import { PaintingService } from '@locart/painting';
import { RentService } from '@locart/rent';
import { orderBy, startAt, where } from 'firebase/firestore';
import { joinWith } from 'ngfire';

const query = (type: 'painting', email: string) => [
  where('email', '==', email),
  where('type', '==', type),
  orderBy('duration.to', 'asc'),
  startAt(new Date()),
];

@Component({
  selector: 'la-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentComponent {
  email = this.auth.user!.email!;
  paintings$ = this.service.valueChanges(query('painting', this.email)).pipe(
    joinWith({
      work: rent => this.paintingService.valueChanges(rent.workId)
    })
  );

  constructor(
    private auth: AuthService,
    private service: RentService,
    private paintingService: PaintingService,
  ) { }

}
