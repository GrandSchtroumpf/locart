import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@locart/auth';

@Component({
  selector: 'la-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  small = false;
  user$ = this.auth.user$;
  constructor(private auth: AuthService) {}

  signout() {
    this.auth.signout();
  }
}
