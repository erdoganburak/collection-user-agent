import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ProductType } from 'src/app/enum/product-type.enum';
import { environment } from 'src/environments/environment';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import Product from 'src/model/product/product';

@Component({
    selector: 'app-shopping-cart-item',
    templateUrl: './shopping-cart-item.component.html',
    styleUrls: ['./shopping-cart-item.component.scss']
})

export class ShoppingCartItemComponent implements OnInit, OnDestroy {

    @Input() product: Product;
    @Output() onProductDeleted = new EventEmitter<Product>();

    public imagePath: string;

    constructor() {

    }

    ngOnInit(): void {
        this.setImage();
    }

    ngOnDestroy(): void {

    }

    public onClickDelete(): void {
        this.onProductDeleted.emit(this.product);
    }

    private setImage(): void {
        let frontImage;
        if (this.product.productType === ProductType.Money) {
            frontImage = (this.product as CollectibleMoneyBasic).frontImage;
        } else if (this.product.productType === ProductType.Movie) {
            frontImage = (this.product as CollectibleMoneyBasic).frontImage;
        }
        this.imagePath = environment.API_IMAGE_PATH + frontImage;
    }


}
