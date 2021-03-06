import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductStatus } from 'src/app/enum/product-status.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { Pagination } from 'src/constant/pagination.constant';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

    public moneyRequest: CollectibleMoneyFilterRequest;
    public moneyTitle: string;
    public moneyShowAll: boolean;
    public movieRequest: CollectibleMovieFilterRequest;
    public movieTitle: string;
    public movieShowAll: boolean;
    public showPagination: boolean;
    public centerTitle: boolean;

    constructor() {

    }

    ngOnInit(): void {
        this.moneyRequest = this.createCollectibleMoneyRequest();
        this.moneyTitle = "Son Eklenen Koleksiyonel Paralar";
        this.moneyShowAll = true;
        this.movieRequest = this.createCollectibleMovieRequest();
        this.movieTitle = "Son Eklenen Filmler";
        this.movieShowAll = true;
        this.showPagination = false;
        this.centerTitle = true;
    }

    ngOnDestroy(): void {

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
            emission: "",
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
            categories: [],
            year: null,
            format: null,
            stock: null,
            status: ProductStatus.Active,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
