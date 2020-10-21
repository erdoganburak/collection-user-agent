import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AnimationBasicFade } from 'src/app/animations/fade.animation';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { RoutingHeaderMenuItem } from 'src/service/routing.service';

@Component({
    selector: 'app-menu-navigation',
    templateUrl: './menu-navigation.component.html',
    styleUrls: ['./menu-navigation.component.scss'],
    animations: ListAnimation
})

export class MenuNavigationComponent implements OnInit, OnDestroy {

    @Input() menuItems: Array<RoutingHeaderMenuItem>;
    @Input() title: string;
    @Input() description: string;
    @Input() icon: string;

    constructor() {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
