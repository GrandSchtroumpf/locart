import { style, transition, trigger, query, animate } from '@angular/animations';

export const animState = trigger('animState', [
  transition('* => *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(
      ':enter, :leave',
      style({ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, overflow: 'hidden' }),
      { optional: true }
    ),
    query(':enter', style({ opacity: 0, transform: 'scale(1.1)' }), { optional: true }),
    query(':leave', animate('200ms', style({ opacity: 0, transform: 'scale(0.9)' })), {
      optional: true,
    }),
    query(':enter', animate('200ms', style({ opacity: 1, transform: 'scale(1)' })), {
      optional: true,
    }),
  ]),
]);
