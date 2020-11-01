import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss']
})

export class ShoppingCartComponent implements OnInit, OnDestroy {

    public options: AnimationOptions = {
        path: '../../../assets/animations/empty-cart.json',
        loop: false
    };

    public styles: Partial<CSSStyleDeclaration> = {
        maxWidth: '500px',
        margin: '0 auto',
    };

    public animationCreated(animationItem: AnimationItem): void {
        console.log(animationItem);
    }

    constructor() {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
