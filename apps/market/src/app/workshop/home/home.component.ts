import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@locart/auth';
import { PaintingService } from '@locart/painting';
import { where } from 'firebase/firestore';

@Component({
  selector: 'la-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  uid = this.auth.user!.uid;
  paintings$ = this.paintingService.valueChanges([where('owner', '==', this.uid)]);
  
  constructor(
    private auth: AuthService,
    private paintingService: PaintingService
  ) { }

}
