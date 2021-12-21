import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './service';

function join(...segments: string[]) {
  const parts = segments.reduce((parts: string[], segment: string) => {
    // Remove leading slashes from non-first part.
    if (parts.length > 0) {
      segment = segment.replace(/^\//, '');
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '');
    return [...parts, ...segment.split('/') ];
  }, [])
  const resultParts: string[] = []
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resultParts.pop();
      continue;
    }
    resultParts.push(part);
  }
  return resultParts.join('/');
}

// Remove "#" & trailing "/" (returned by stripe)
function cleanUrl(url: string) {
  return url
    .split('/')
    .filter((segment) => !!segment)
    .map((segment) => segment.replace('#', ''))
    .join('/');
}

@Injectable({ providedIn: 'root' })
export class IsConnectedGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private auth: AuthService,
    private router: Router
  ) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (isPlatformServer(this.platformId)) return true;

    // Url to redirect to if the user is not connected
    const redirect: string = next.data.redirect ? join(state.url, next.data.redirect) : '/auth';
    // Url to redirect to once the user is connected
    this.auth.redirectUrl = cleanUrl(state.url);

    const user = await this.auth.awaitUser();
    if (!user) {
      return this.router.createUrlTree([redirect]);
    }
    if (!user.emailVerified) {
      return this.router.createUrlTree(['/auth/verification']);
    }

    const profile = await this.auth.getValue();
    if (!profile) {
      return this.router.createUrlTree([redirect]);
    }

    if (!profile.type) {
      return this.router.createUrlTree(['/auth/profile-type']);
    }

    delete this.auth.redirectUrl;
    if (state.url.startsWith('/workshop')) {
      if (profile.type !== 'seller') {
        return this.router.createUrlTree(['/profile']);
      }
      return true;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class IsNotConnectedGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url.startsWith('/auth/action')) {
      return true;
    }
    const user = await this.auth.awaitUser();
    if (!user) {
      return true;
    }
    if (!user.emailVerified) {
      if (state.url === '/auth/verification') return true;
      return this.router.createUrlTree(['/auth/verification']);
    }
    return this.router.createUrlTree(['/']);
  }
}
