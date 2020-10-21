import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

export const ListAnimation = [trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('0ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
])];