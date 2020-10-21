import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AnimationBasicFade } from 'src/app/animations/fade.animation';
import { RoutingHeaderMenuItem, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})

export class MenuItemComponent implements OnInit, OnDestroy {

    @Input() item: RoutingHeaderMenuItem;

    constructor(private routingService: RoutingService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    onClickMenuItem() {
        this.routingService.gotoPage(this.item.page.fullPath);
    }

}
