export * from './lib/state-transfer';
export * from './lib/page';
export * from './lib/seo';
export * from './lib/icon';
export * from './lib/animations';
export * from './lib/breakpoint';
export * from './lib/track-by';
export * from './lib/form';
export * from './lib/coerc';
export * from './lib/date-adapter';

export function exist<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
