import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import GetProductsRequest from 'src/model/product/get-products-request.model';
import Product from 'src/model/product/product';
import { ProductApiService } from 'src/service/product/product-api.service';
import { ShoppingCartService } from 'src/service/shopping-cart.service';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss']
})

export class ShoppingCartComponent implements OnInit, OnDestroy {

    public cartItems: Array<string>;
    public products: Array<Product>;

    private productServiceSubscription: Subscription;

    constructor(private shoppingCartService: ShoppingCartService,
        private productService: ProductApiService) {
        this.cartItems = [];
        this.products = []
    }

    ngOnInit(): void {
        this.cartItems = this.shoppingCartService.getShoppingCartItems();
        if (this.cartItems.length > 0) {
            this.productServiceSubscription = this.productService.getProducts(this.createRequest()).subscribe(
                (response: Array<Product>) => {
                    if (response) {
                        this.products = response;
                    }
                }
            );
        }
    }

    ngOnDestroy(): void {
        if (this.productServiceSubscription) this.productServiceSubscription.unsubscribe();
    }

    private createRequest(): GetProductsRequest {
        return {
            productIds: this.cartItems
        }
    }

}
