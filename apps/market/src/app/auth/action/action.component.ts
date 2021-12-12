import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, errorCode } from '@locart/auth';
import { sendEmailVerification, verifyPasswordResetCode, applyActionCode, confirmPasswordReset, reload } from 'firebase/auth';

const modes = ['resetPassword', 'recoverEmail', 'verifyEmail', 'error'] as const;
type Mode = typeof modes[number];

@Component({
  selector: 'la-auth-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthActionComponent implements OnInit {
  @ViewChild('error') error!: TemplateRef<unknown>;
  newPassword = new FormControl();
  showPwd = false;
  emailVerified = false;
  mode?: Mode;
  code?: string | null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Record<string, unknown>,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) {}

  // See : https://firebase.google.com/docs/reference/js/firebase.auth.Auth#applyactioncode
  private async showError(err: { code: string; message: string }) {
    console.error(err);
    const [_, code] = err.code.split('/');
    if (errorCode.includes(code)) {
      this.snackbar.openFromTemplate(this.error, {
        data: code,
        duration: 3000,
      });
    }
    if (code === 'expired-action-code') {
      const user = this.auth.user!;
      await sendEmailVerification(user, { url: this.auth.verificationUrl });
    }
    this.mode = 'error';
    this.cdr.markForCheck();
  }

  private async reload() {
    const user = await this.auth.awaitUser();
    if (!user) return;
    return reload(user);
  }

  async ngOnInit() {
    // Avoid to preload the page on the server
    if (isPlatformServer(this.platformId)) return;
    const { mode, oobCode } = this.route.snapshot.queryParams;
    if (!modes.includes(mode) || !oobCode) return this.router.navigate(['/auth']);
    this.mode = mode;
    this.code = oobCode;
    if (this.mode === 'resetPassword') {
      await verifyPasswordResetCode(this.auth.auth, oobCode);
    }
    if (this.mode === 'verifyEmail') {
      try {
        const user = this.auth.user!;
        if (!user?.emailVerified) {
          await applyActionCode(this.auth.auth, oobCode);
          await this.reload();
        }
        this.emailVerified = true;
      } catch (err: any) {
        this.showError(err);
      }
    }
    this.cdr.markForCheck();
    return;
  }

  async resetPassword(e: Event) {
    e.preventDefault();
    if (this.newPassword.valid && this.code) {
      try {
        await confirmPasswordReset(this.auth.auth, this.code, this.newPassword.value);
        await this.reload();
        await this.router.navigate(['/auth']);
      } catch (err: any) {
        this.showError(err);
      }
    } else {
      this.newPassword.markAsTouched();
    }
  }
}
