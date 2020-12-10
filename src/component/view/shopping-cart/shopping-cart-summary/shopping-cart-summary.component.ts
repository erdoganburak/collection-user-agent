import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { PageRoutes } from 'src/constant/page-routes.constant';
import Product from 'src/model/product/product';
import { RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-shopping-cart-summary',
    templateUrl: './shopping-cart-summary.component.html',
    styleUrls: ['./shopping-cart-summary.component.scss']
})

export class ShoppingCartSummaryComponent implements OnInit, OnDestroy {

    @Input() products: Array<Product>;

    public sum: number = undefined;

    constructor(private routingService: RoutingService) {

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

    public onClickBuy() {
        this.routingService.gotoPage(PageRoutes.CHECKOUT.fullPath, null);
    }

    private calculateSum() {
        this.sum = 0;
        this.products.forEach(element => {
            this.sum += element.price;
        });
    }

}
