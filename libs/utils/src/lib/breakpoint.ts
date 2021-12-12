import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';

type Breakpoints = Extract<keyof typeof Breakpoints, string>;
const breakpoints = {
  mobile: ['XSmall'],
  tablet: ['Small', 'Medium'],
  desktop: ['Large', 'XLarge'],
  xs: ['XSmall'],
  sm: ['Small'],
  md: ['Medium'],
  lg: ['Large'],
  xl: ['XLarge'],
  'gt-xs': ['Small', 'Medium', 'Large', 'XLarge'],
  'gt-sm': ['Medium', 'Large', 'XLarge'],
  'gt-md': ['Large', 'XLarge'],
  'gt-lg': ['XLarge'],
  'lt-sm': ['XSmall'],
  'lt-md': ['XSmall', 'Small'],
  'lt-lg': ['XSmall', 'Small', 'Medium'],
  'lt-xl': ['XSmall', 'Small', 'Medium', 'Large'],
};
type Size = Extract<keyof typeof breakpoints, string>;

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private cache: Record<string, Observable<boolean>> = {}

  constructor(private breakpointObserver: BreakpointObserver) {}

  public isSize(size: Size) {
    if (!this.cache[size]) {
      const keys = breakpoints[size] as Breakpoints[];
      const bp = keys.map((key) => Breakpoints[key]);
      this.cache[size] = this.breakpointObserver.observe(bp).pipe(
        distinctUntilChanged((a, b) => a.matches === b.matches),
        map((result) => result.matches),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.cache[size];
  }

  public matches(size: Size) {
    const keys = breakpoints[size] as Breakpoints[];
    const bp = keys.map((key) => Breakpoints[key]);
    return this.breakpointObserver.isMatched(bp)
  }
}
