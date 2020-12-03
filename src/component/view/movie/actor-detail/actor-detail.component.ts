import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { ProductStatus } from 'src/app/enum/product-status.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { MovieFormats } from 'src/constant/movie-format.constant';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { Pagination } from 'src/constant/pagination.constant';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import { environment } from 'src/environments/environment';
import ActorBasic from 'src/model/actor/actor-basic.model';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { ActorApiService } from 'src/service/actor/actor-api.service';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';
import { RoutingParams, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-actor-detail',
    templateUrl: './actor-detail.component.html',
    styleUrls: ['./actor-detail.component.scss'],
    animations: ListAnimation
})

export class ActorDetailComponent implements OnInit, OnDestroy {

    public collectibleMovies: Array<CollectibleMovieBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public item: ActorBasic;
    public id: string;
    public imagePath: string;
    public otherProductsTitle: string;
    public otherProductsRequest: CollectibleMovieFilterRequest;
    public showAll: boolean;
    public showPagination: boolean;
    public centerTitle: boolean;
    public centerProducts: boolean;
    public dontUseRouting: boolean;
    public formats;

    private routingParams: RoutingParams;
    private collectibleMovieSubscription: Subscription;
    private actorSubscription: Subscription;
    private images: Array<string>;

    constructor(
        private route: ActivatedRoute,
        private routingService: RoutingService,
        private collectibleMovieService: CollectibleMovieApiService,
        private actorService: ActorApiService
    ) {
    }

    ngOnInit(): void {
        this.images = [];
        this.formats = MovieFormats;
        this.route.queryParams.subscribe(params => {
            this.routingParams = this.routingService.getRoutingParams(
                params,
                [RoutingParamKeys.ActorId],
                [RoutingParamKeys.ActorId]
            );

            this.id = this.routingParams[RoutingParamKeys.ActorId];
            this.getActorById();

        });
    }

    ngOnDestroy(): void {
        if (this.collectibleMovieSubscription) this.collectibleMovieSubscription.unsubscribe();
        if (this.actorSubscription) this.actorSubscription.unsubscribe();
    }

    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {

        let categoryIds = [];

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
            actors: [this.id],
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

    private getActorById() {
        if (this.routingParams.hasParam) {
            if (!this.item && this.routingParams[RoutingParamKeys.ActorId]) {
                this.id = this.routingParams[RoutingParamKeys.ActorId];
            }
            this.images = [];
            this.actorSubscription = this.actorService.getActorById(this.id).subscribe(
                (response: ActorBasic) => {
                    this.item = response;
                    this.imagePath = environment.API_IMAGE_PATH + this.item.image;
                    if (this.item.image)
                        this.images.push(this.item.image);
                    this.initializeOtherProducts();
                }
            );
        }
    }

    private initializeOtherProducts(): void {
        this.otherProductsTitle = "Sanatçının Rol Aldığı Filmler"
        this.otherProductsRequest = this.createCollectibleMovieRequest();
        this.showAll = false;
        this.showPagination = true;
        this.centerTitle = true;
        this.centerProducts = true;
        this.dontUseRouting = true;
    }

    public otherProductItemClicked(item: CollectibleMovieBasic): void {
        let params = {};
        params[RoutingParamKeys.MovieId] = item._id;
        this.routingService.gotoPage(PageRoutes.MOVIE_DETAIL.fullPath, params);
    }

}
