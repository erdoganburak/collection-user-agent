import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import Product from 'src/model/product/product';

@Component({
    selector: 'app-shopping-cart-summary',
    templateUrl: './shopping-cart-summary.component.html',
    styleUrls: ['./shopping-cart-summary.component.scss']
})

export class ShoppingCartSummaryComponent implements OnInit, OnDestroy {

    @Input() products: Array<Product>;

    public sum: number = undefined;

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges) {
        this.products = changes.products.currentValue;
        this.calculateSum();
    }

    ngOnInit(): void {
        this.calculateSum();
    }

    ngOnDestroy(): void {

    }

    private calculateSum() {
        this.sum = 0;
        this.products.forEach(element => {
            this.sum += element.price;
        });
    }

}
