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
  profile$ = this.auth.profile$;
  constructor(private auth: AuthService) {}

  signout() {
    this.auth.signout();
  }
}
