import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private auth: AuthService, private router: Router) {}

  async signout(event: Event) {
    event.stopPropagation();
    await this.auth.signout();
    this.router.navigate(['/']);
  }
}
