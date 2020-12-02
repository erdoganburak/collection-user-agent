import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { Pagination } from 'src/constant/pagination.constant';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import CategoryBasic from 'src/model/category/category-basic.model';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CategoryApiService } from 'src/service/category/category-api.service';
import { RoutingParams, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-category-detail',
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.scss']
})

export class CategoryDetailComponent implements OnInit, OnDestroy {

    public collectibleMovies: Array<CollectibleMovieBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public request: CollectibleMovieFilterRequest;
    public showAll: boolean;
    public showPagination: boolean;
    public id: string;
    public item: CategoryBasic
    public centerTitle: boolean;
    public centerProducts: boolean;
    public dontUseRouting: boolean;
    public otherProductsTitle: string;
    public otherProductsRequest: CollectibleMovieFilterRequest;

    private routingParams: RoutingParams;
    private categorySubscription: Subscription;

    constructor(private route: ActivatedRoute,
        private routingService: RoutingService,
        private categoryService: CategoryApiService
    ) {

    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.routingParams = this.routingService.getRoutingParams(
                params,
                [RoutingParamKeys.CategoryId],
                [RoutingParamKeys.CategoryId]
            );
            this.getCategoryById();
        });
    }

    ngOnDestroy(): void {
        if (this.categorySubscription) this.categorySubscription.unsubscribe();
    }

    private getCategoryById() {
        if (this.routingParams.hasParam) {
            this.id = this.routingParams[RoutingParamKeys.CategoryId];
            this.categorySubscription = this.categoryService.getCategoryById(this.id).subscribe(
                (response: CategoryBasic) => {
                    this.item = response;
                    this.title = response.name;
                    this.description = "Arşivimizdeki " + response.name + " filmleri";
                    this.request = this.createCollectibleMovieRequest();
                    this.showAll = false;
                    this.showPagination = true;
                    this.initializeOtherProducts();
                }
            );
        }
    }

    private initializeOtherProducts(): void {
        this.otherProductsRequest = this.createCollectibleMovieRequest();
        this.showAll = false;
        this.showPagination = true;
    }

    public otherProductItemClicked(item: CollectibleMovieBasic): void {
        let params = {};
        params[RoutingParamKeys.MovieId] = item._id;
        this.routingService.gotoPage(PageRoutes.MOVIE_DETAIL.fullPath, params);
    }
    
    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: Pagination.DETAIL_PAGINATION_LIMIT
        }
        return {
            productType: ProductType.Movie,
            condition: null,
            name: "",
            minPrice: null,
            maxPrice: null,
            actors: [],
            directors: [],
            categories: [this.id],
            year: null,
            format: null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
