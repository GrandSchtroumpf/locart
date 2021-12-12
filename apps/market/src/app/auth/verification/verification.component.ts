import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@locart/auth';
import { slideListUp } from '@locart/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'la-auth-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
  animations: [slideListUp('section > *')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationComponent {
  @ViewChild('success') success!: TemplateRef<unknown>;
  user$ = this.auth.user$;

  constructor(private auth: AuthService, private snackbar: MatSnackBar, private router: Router) {}

  async resend() {
    const user = this.auth.user;
    if (!user) return;
    await sendEmailVerification(user, { url: this.auth.verificationUrl });
    this.snackbar.openFromTemplate(this.success, { duration: 1500 });
  }

  async signout() {
    await this.auth.signout();
    this.router.navigate(['/']);
  }
}
