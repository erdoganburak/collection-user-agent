import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { ProductStatus } from 'src/app/enum/product-status.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { Pagination } from 'src/constant/pagination.constant';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import CollectibleMovieFilterResponse from 'src/model/collectible-movie/collectible-movie-filter-response';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';
import { RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-movie-showcase',
    templateUrl: './movie-showcase.component.html',
    styleUrls: ['./movie-showcase.component.scss'],
    animations: ListAnimation
})

export class MovieShowcaseComponent implements OnInit, OnDestroy {

    @Input() title: string;
    @Input() description?: string;
    @Input() showAll?: boolean;
    @Input() showPagination?: boolean;
    @Input() centerTitle?: boolean;
    @Input() centerProducts?: boolean;
    @Input() request: CollectibleMovieFilterRequest;
    @Input() dontUseRouting?: boolean;

    @Output() itemClicked = new EventEmitter<CollectibleMovieBasic>();

    public collectibleMovies: Array<CollectibleMovieBasic>;
    public paginationResponse: PaginationResponse;

    private pageNumber: number;

    constructor(private collectibleMovieService: CollectibleMovieApiService, private routingService: RoutingService) {

    }

    ngOnInit(): void {
        this.pageNumber = 1;
        this.getData();
    }

    ngOnDestroy(): void {

    }

    public onClickShowAll(): void {
        this.routingService.gotoPage(PageRoutes.MOVIES.fullPath);
    }

    public pageNumberChanged(pageNumber): void {
        this.collectibleMovies = null;
        this.pageNumber = pageNumber;
        this.getData()
    }

    public onClickItem(item: CollectibleMovieBasic) {
        if (this.dontUseRouting) {
            this.itemClicked.emit(item);
        } else {
            let params = {};
            params[RoutingParamKeys.MovieId] = item._id;
            this.routingService.gotoPage(PageRoutes.MOVIE_DETAIL.fullPath, params);
        }
    }

    public getData() {
        this.collectibleMovieService.getCollectibleMovies(this.createCollectibleMovieRequest()).subscribe(
            (response: CollectibleMovieFilterResponse) => {
                if (response) {
                    this.request = null;
                    this.collectibleMovies = response.movies;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {
        if (this.request) {
            return this.request;
        }
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
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
