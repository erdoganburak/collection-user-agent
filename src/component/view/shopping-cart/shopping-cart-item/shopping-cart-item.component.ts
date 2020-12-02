import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import Product from 'src/model/product/product';
import { ShoppingCartService } from 'src/service/shopping-cart.service';

@Component({
    selector: 'app-shopping-cart-item',
    templateUrl: './shopping-cart-item.component.html',
    styleUrls: ['./shopping-cart-item.component.scss']
})

export class ShoppingCartItemComponent implements OnInit, OnDestroy {

    @Input() product: Product;

    constructor(private shoppingCartService: ShoppingCartService) {

    }

    ngOnInit(): void {
        debugger;
    }

    ngOnDestroy(): void {

    }

}
