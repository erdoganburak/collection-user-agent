import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductStatus } from 'src/app/enum/product-status.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { Pagination } from 'src/constant/pagination.constant';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
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
    public title: string;
    public description: string;
    public requestOtherProducts: CollectibleMovieFilterRequest | CollectibleMoneyFilterRequest;
    public showAll: boolean;
    public showPagination: boolean;
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
                        this.title = "İlgilenebileceğiniz Ürünler";
                        this.showAll = false;
                        this.showPagination = false;
                        this.createRelatedProductRequest();
                    }
                }
            );
        }
    }

    private createRelatedProductRequest(): void {
        if (this.products.length > 0) {
            if (this.products[0].productType === ProductType.Movie) {
                this.requestOtherProducts = this.createCollectibleMovieRequest();
            } else if (this.products[0].productType === ProductType.Money) {
                this.requestOtherProducts = this.createCollectibleMoneyRequest();
            }
        }
    }

    ngOnDestroy(): void {
        if (this.productServiceSubscription) this.productServiceSubscription.unsubscribe();
    }

    private createCollectibleMoneyRequest(): CollectibleMoneyFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: Pagination.HOME_PAGINATION_LIMIT
        }
        return {
            productType: ProductType.Money,
            productNo: "",
            name: "",
            serialNo: "",
            minPrice: null,
            maxPrice: null,
            condition: null,
            clippings: [],
            emission: ((this.products[0] as (CollectibleMoneyBasic)).emission._id),
            status: ProductStatus.Active,
            stock: null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: Pagination.HOME_PAGINATION_LIMIT
        }
        return {
            productType: ProductType.Movie,
            condition: null,
            name: "",
            minPrice: null,
            maxPrice: null,
            actors: [],
            directors: [],
            categories: [(this.products[0] as (CollectibleMovieBasic)).categories[0] + ""],
            year: null,
            format: null,
            stock: null,
            status: ProductStatus.Active,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    public onProductDeleted(product: Product): void {
        debugger;
        this.shoppingCartService.removeFromCart(product._id);
        this.products = this.products.filter(item => item._id !== product._id);
        this.requestOtherProducts = null;
        this.createRelatedProductRequest();
    }

    private createRequest(): GetProductsRequest {
        return {
            productIds: this.cartItems
        }
    }

}
