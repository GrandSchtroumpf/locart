import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@locart/auth';

@Component({
  selector: 'la-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  user$ = this.auth.user$;
  constructor(private auth: AuthService) { }
}
