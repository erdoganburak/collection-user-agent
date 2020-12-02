import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListAnimation } from 'src/app/animations/list-up.animation';
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
import DirectorBasic from 'src/model/director/director-basic.model';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';
import { DirectorApiService } from 'src/service/director/director-api.service';
import { RoutingParams, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-director-detail',
    templateUrl: './director-detail.component.html',
    styleUrls: ['./director-detail.component.scss'],
    animations: ListAnimation
})

export class DirectorDetailComponent implements OnInit, OnDestroy {

    public collectibleMovies: Array<CollectibleMovieBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public item: DirectorBasic;
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
    private directorSubscription: Subscription;
    private images: Array<string>;

    constructor(
        private route: ActivatedRoute,
        private routingService: RoutingService,
        private collectibleMovieService: CollectibleMovieApiService,
        private directorService: DirectorApiService
    ) {
    }

    ngOnInit(): void {
        this.images = [];
        this.formats = MovieFormats;
        this.route.queryParams.subscribe(params => {
            this.routingParams = this.routingService.getRoutingParams(
                params,
                [RoutingParamKeys.DirectorId],
                [RoutingParamKeys.DirectorId]
            );

            this.id = this.routingParams[RoutingParamKeys.DirectorId];
            this.getDirectorById();
        });
    }

    ngOnDestroy(): void {
        if (this.collectibleMovieSubscription) this.collectibleMovieSubscription.unsubscribe();
        if (this.directorSubscription) this.directorSubscription.unsubscribe();
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
            directors: [this.item._id],
            categories: [],
            year: null,
            format: null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    private getDirectorById() {
        if (this.routingParams.hasParam) {
            if (!this.item && this.routingParams[RoutingParamKeys.DirectorId]) {
                this.id = this.routingParams[RoutingParamKeys.DirectorId];
            }
            this.images = [];
            this.directorSubscription = this.directorService.getDirectorById(this.id).subscribe(
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
        this.otherProductsTitle = "Yönetmenin Diğer Filmleri"
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
