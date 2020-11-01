import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-empty-cart',
    templateUrl: './empty-cart.component.html',
    styleUrls: ['./empty-cart.component.scss']
})

export class EmptyCartComponent implements OnInit, OnDestroy {

    public options: AnimationOptions = {
        path: '../../../../assets/animations/empty-cart.json',
        loop: false
    };

    public styles: Partial<CSSStyleDeclaration> = {
        maxWidth: '500px',
        margin: '0 auto',
    };

    public animationCreated(animationItem: AnimationItem): void {
        console.log(animationItem);
    }

    constructor(private routingService: RoutingService) {

    }

    public onClickStartShopping(): void {
        this.routingService.gotoPage(PageRoutes.HOME.fullPath);
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
