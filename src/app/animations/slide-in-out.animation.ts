import { trigger, style, animate, transition, state } from '@angular/animations';

export const AnimationSlideInOut = [
    trigger('slideInOut', [
        transition(':enter', [
            style({ transform: 'translateY(-20%)' }),
            animate('300ms', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            animate('300ms', style({ transform: 'translateY(-20%)' }))
        ])
    ])
];