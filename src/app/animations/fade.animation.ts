import { trigger, style, animate, transition, state } from '@angular/animations';

export const AnimationBasicFade = [
  trigger('fade', [
    transition('void => *', [
      style({ opacity: 0 }),
      animate(500, style({ opacity: 1 }))
    ])
  ])
];

export const AnimationEnterLeaveFade = [
  trigger(
    'enterLeaveFade',
    [
      transition(
        ':enter', [
        style({ 'opacity': 0 }),
        animate('200ms', style({ 'opacity': 1 }))
      ]
      ),
      transition(
        ':leave', [
        style({ 'opacity': 1 }),
        animate('200ms', style({ 'opacity': 0 })),
      ]
      )
    ]
  )
];

