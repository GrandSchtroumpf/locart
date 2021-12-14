import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@locart/auth';
import { PaintingService } from '@locart/painting';

@Component({
  selector: 'la-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  uid = this.auth.user!.uid;
  paintings$ = this.paintingService.valueChanges({ userId: this.uid });
  
  constructor(
    private auth: AuthService,
    private paintingService: PaintingService
  ) { }

}
