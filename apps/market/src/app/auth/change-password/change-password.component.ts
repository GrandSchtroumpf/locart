import { ChangeDetectionStrategy, Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@locart/auth';
import { slideListUp } from '@locart/utils';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'la-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [slideListUp('section > *')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
  @ViewChild('mailResent') mailResent!: TemplateRef<unknown>;
  email$ = this.route.paramMap.pipe(map((params) => params.get('email')));

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  async resend(email: string) {
    await sendPasswordResetEmail(this.auth.auth, email);
    this.snackbar.openFromTemplate(this.mailResent, { duration: 1500 });
  }

  async signout() {
    await this.auth.signout();
    this.router.navigate(['/']);
  }
}
