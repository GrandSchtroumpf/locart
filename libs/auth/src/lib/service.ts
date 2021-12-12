import { Injectable } from '@angular/core';
import { Profile } from '@locart/model';
import { FireAuth } from 'ngfire';
import { User } from 'firebase/auth';
import { map } from 'rxjs/operators';
import env from '@env';

export const errorCode = [
  'internal-error',
  'invalid-email',
  'invalid-password',
  'user-not-found',
  'email-already-in-use',
  'wrong-password',
  'weak-password',
  'unconfirmed',
  'expired-action-code',
  'invalid-action-code',
];

@Injectable({ providedIn: 'root' })
export class AuthService extends FireAuth<Profile> {
  readonly path = 'users';
  verificationUrl = env.baseUrl;
  redirectUrl?: string;

  isSeller$ = this.profile$.pipe(map((profile) => profile?.isSeller ?? false));

  constructor() {
    super();
  }

  createProfile(user: User): Profile {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: user.email!,
      isSeller: false,
      avatar: null,
      name: user.displayName,
      tel: user.phoneNumber,
    };
  }
}
