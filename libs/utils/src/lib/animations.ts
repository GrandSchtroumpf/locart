import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  sequence,
  stagger,
  animateChild,
  state,
} from '@angular/animations';

export const enum Easing {
  easeInSine = ' cubic-bezier(0.47, 0, 0.745, 0.715)',
  easeOutSine = ' cubic-bezier(0.39, 0.575, 0.565, 1)',
  easeInOutSine = ' cubic-bezier(0.445, 0.05, 0.55, 0.95)',

  easeIncubic = ' cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutcubic = ' cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutcubic = ' cubic-bezier(0.645, 0.045, 0.355, 1)',

  easeInQuint = ' cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeOutQuint = ' cubic-bezier(0.23, 1, 0.32, 1)',
  easeInOutQuint = ' cubic-bezier(0.86, 0, 0.07, 1)',

  easeInCirc = ' cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeOutCirc = ' cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeInOutCirc = ' cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  easeInQuad = ' cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad = ' cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad = ' cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  easeInQuart = ' cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart = ' cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart = ' cubic-bezier(0.77, 0, 0.175, 1)',

  easeInExpo = ' cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeOutExpo = ' cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutExpo = ' cubic-bezier(1, 0, 0, 1)',

  easeInBack = ' cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack = ' cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack = ' cubic-bezier(0.68, -0.55, 0.265, 1.55)',

}

/** Prepare page before leaving/entering (use absolute to get out of the page flow) */
const prepare = [
  style({ position: 'relative', overflow: 'hidden' }),
  query(
    ':enter, :leave',
    [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }),
    ],
    { optional: true }
  ),
];

// https://material.io/design/motion/the-motion-system.html#fade-through
const fadeThrough = [
  query(':enter', [
    style({ opacity: 0, transform: 'scale(0.97)' }),
  ], { optional: true }),
  query(':leave', [
    animate(`90ms ${Easing.easeIncubic}`, style({ opacity: 0 }))
  ], { optional: true }),
  query(':enter', [
    animate(`210ms ${Easing.easeOutcubic}`, style({ opacity: 1, transform: 'scale(1)' }))
  ], { optional: true })
];

export const routeAnimation = trigger('routeAnimation', [
  // Slide up
  // Prevent homepage to run animation from "void"
  transition('0 => dialog, 1 => dialog, 2 => dialog, 3 => dialog, dialog => dialog', [
    ...prepare,
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(40vh)',
          boxShadow: '0px -2px 16px 0px rgba(0,0,0,0.3)',
        }),
      ],
      { optional: true }
    ),
    group([
      query(
        ':leave',
        [animate(`200ms ${Easing.easeIncubic}`, style({ opacity: 0, transform: 'scale(0.95)' }))],
        { optional: true }
      ),
      query(
        ':enter',
        [
          animate(
            `500ms 100ms ${Easing.easeOutCirc}`,
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
  // Slide down
  transition('dialog => *', [
    ...prepare,
    query(':enter', [style({ opacity: 0, transform: 'scale(0.95)' })], { optional: true }),
    query(':leave', [style({ zIndex: 1, boxShadow: '0px -2px 16px 0px rgba(0,0,0,0.3)' })], {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [
          animate(
            `500ms ${Easing.easeIncubic}`,
            style({ opacity: 0, transform: 'translateY(60vh)' })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          animate(
            `200ms 400ms ${Easing.easeOutCirc}`,
            style({ opacity: 1, transform: 'scale(1)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
  transition(':increment', [
    ...prepare,
    ...fadeThrough,
    query(':enter', animateChild()),
  ]),
  transition(':decrement', [
    ...prepare,
    ...fadeThrough,
    query(':enter', animateChild()),
  ]),
  // Layout
  transition('home <=> buyer, home <=> seller, buyer <=> seller', [
    ...prepare,
    query(':enter', [style({ opacity: 0, transform: 'scale(0.9)' })], { optional: true }),
    query(':leave', [animate(`200ms ${Easing.easeIncubic}`, style({ opacity: 0 }))], {
      optional: true,
    }),
    query(
      ':enter',
      [animate(`500ms ${Easing.easeOutcubic}`, style({ opacity: 1, transform: 'scale(1)' }))],
      { optional: true }
    ),
    query(':enter', animateChild()),
  ]),
]);

//////////
// ITEM //
//////////

export const counter = trigger('counter', [
  transition(':increment', [
    animate(`50ms ${Easing.easeIncubic}`, style({ opacity: 0, transform: 'translateY(-100%)' })),
    animate('10ms', style({ transform: 'translateY(100%)' })),
    animate(`150ms ${Easing.easeOutcubic}`, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':decrement', [
    animate(`50ms ${Easing.easeIncubic}`, style({ opacity: 0, transform: 'translateY(100%)' })),
    animate('10ms', style({ transform: 'translateY(-100%)' })),
    animate(`150ms ${Easing.easeOutcubic}`, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

export const expandFab = trigger('expandFab', [
  state('true', style({ maxWidth: '200px' })),
  state('false', style({ maxWidth: '48px' })),
  transition('false => true', sequence([
    query('span', [
      animate('0ms', style({ opacity: 0, transform: 'translateX(30px)' }))
    ]),
    animate(`200ms ${Easing.easeIncubic}`, style({ maxWidth: '200px' })),
    query('span', [
      animate('100ms 40ms', style({ opacity: 1, transform: 'translateX(0)' }))
    ]),
  ])),
  transition('true => false', sequence([
    query('span', animate('100ms', style({ opacity: 0, transform: 'translateX(30px)' }))),
    animate(`200ms 40ms ${Easing.easeOutcubic}`, style({ maxWidth: '40px' })),
  ]))
])

export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate(`200ms ${Easing.easeIncubic}`),
  ]),
  transition(':leave', [
    animate(`200ms ${Easing.easeOutcubic}`, style({ opacity: 0, transform: 'scale(0.9)' })),
  ]),
]);

//////////
// LIST //
//////////
export const slideListLeft = (selector: string) =>
  trigger('slideListLeft', [
    transition(':enter', [
      query(
        selector,
        [
          style({ opacity: 0, transform: 'translateX(100px)' }),
          stagger('50ms', [animate(`400ms ${Easing.easeOutcubic}`)]),
        ],
        { optional: true }
      ),
    ]),
  ]);

export const slideListUp = (selector: string) =>
  trigger('slideListUp', [
    transition(':enter', [
      query(
        selector,
        [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger('50ms', [animate(`300ms ${Easing.easeOutcubic}`)]),
        ],
        { optional: true }
      ),
    ]),
  ]);

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(50px)' }),
    animate(`200ms ${Easing.easeIncubic}`),
  ]),
  transition(':leave', [
    animate(`200ms ${Easing.easeOutcubic}`, style({ opacity: 0, transform: 'translateY(50px)' })),
  ]),
]);

export const slideDown = trigger('slideDown', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate(`200ms ${Easing.easeIncubic}`),
  ]),
  transition(':leave', [
    animate(`200ms ${Easing.easeOutcubic}`, style({ transform: 'translateY(-100%)' })),
  ]),
]);

export const fadeList = (selector: string) =>
  trigger('fadeList', [
    transition(':enter', [
      query(
        selector,
        [
          style({ opacity: 0, transform: 'scale(0.9)' }),
          stagger('50ms', [animate(`200ms ${Easing.easeOutcubic}`)]),
        ],
        { optional: true }
      ),
    ]),
  ]);
