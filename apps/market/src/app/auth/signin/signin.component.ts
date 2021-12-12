import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService, errorCode } from '@locart/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fade, IconService } from '@locart/utils';
import { TranslocoService } from '@ngneat/transloco';
import { map } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';

/** Error when invalid control is dirty, touched, or submitted. */
export class ConfirmStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control || !form) return false;
    const isSubmitted = !!form?.submitted;
    return form.hasError('notConfirmed') && (control.dirty || control.touched || isSubmitted);
  }
}
type Mode = 'signin' | 'signup';

function isConfirmed(getMode: () => Mode | null) {
  return (form: AbstractControl) => {
    const mode = getMode();
    const { password, confirm } = form.value;
    if (mode === 'signup') {
      if (!confirm || confirm !== password) return { notConfirmed: true };
    }
    return null;
  }
}

@Component({
  selector: 'la-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [fade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  @ViewChild('error') error?: TemplateRef<unknown>;
  isBrowser = isPlatformBrowser(this.platformId);
  confirmErrorState = new ConfirmStateMatcher();
  showPwd = false;
  passwordFocus?: boolean;
  mode$ = this.route.queryParamMap.pipe(
    map(query => (query.get('mode') || 'signin') as Mode)
  );
  nextMode$ = this.mode$.pipe(map(mode => mode === 'signin' ? 'signup' : 'signin'));
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirm: new FormControl('')
  }, {
    validators: isConfirmed(() => this.route.snapshot.queryParams.mode)
  });

  constructor(
    icon: IconService,
    transloco: TranslocoService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Record<string, unknown>
  ) {
    icon.register('google');
    this.auth.auth.languageCode = transloco.getActiveLang();
    const email = this.route.snapshot.queryParamMap.get('email');
    this.form.get('email')?.setValue(email);
  }

  set signing(isSigning: boolean) {
    isSigning ? this.form.disable() : this.form.enable();
  }

  get signing() {
    return this.form.disabled;
  }

  // See : https://firebase.google.com/docs/reference/js/firebase.auth.Auth
  private showError(err: { code: string; message: string }) {
    console.error(err);
    const [_, code] = err.code.split('/');
    if (this.error && errorCode.includes(code)) {
      this.snackbar.openFromTemplate(this.error, {
        data: code,
        duration: 3000,
      });
    }
  }

  async signinWithGoogle() {
    this.signing = true;
    try {
      await this.auth.signin(new GoogleAuthProvider());
      const redirect = this.auth.redirectUrl || '/s/profile'; // If not seller, guard will redirect
      this.router.navigate([redirect]);
    } catch (err: any) {
      this.showError(err);
      this.signing = false;
    }
    this.cdr.markForCheck();
  }

  private async signin() {
    const { email, password } = this.form.value;
    await this.auth.signin(email, password);
    const redirect = this.auth.redirectUrl || '/s/profile'; // If not seller, guard will redirect
    await this.router.navigate([redirect]);
  }

  private async signup() {
    const { email, password } = this.form.value;
    await this.auth.signup(email, password);
    await this.router.navigate(['/auth/verification']);
  }

  async submit(mode: Mode) {
    if (this.form.valid) {
      this.signing = true;
      try {
        mode === 'signup'
          ? await this.signup()
          : await this.signin();
      } catch (err: any) {
        this.signing = false;
        this.showError(err);
      }
      this.cdr.markForCheck();
    } else {
      this.form.get('confirm')?.markAsTouched();
    }
  }

  async resetPassword() {
    if (this.form.get('email')?.valid) {
      try {
        const { email } = this.form.value;
        await sendPasswordResetEmail(this.auth.auth, email);
        await this.router.navigate(['/auth/change-password', email]);
      } catch (err: any) {
        this.showError(err);
      }
    } else {
      this.form.get('email')?.markAsTouched();
    }
  }
}
