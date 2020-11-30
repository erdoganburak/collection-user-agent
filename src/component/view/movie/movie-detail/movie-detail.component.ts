import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { ImageModal } from 'src/component/common/image-modal/image-modal.component';
import { MovieFormats } from 'src/constant/movie-format.constant';
import { Pagination } from 'src/constant/pagination.constant';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import { environment } from 'src/environments/environment';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';
import { RoutingParams, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-movie-detail',
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.scss'],
    animations: ListAnimation
})

export class MovieDetailComponent implements OnInit, OnDestroy {

    public collectibleMovies: Array<CollectibleMovieBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public item: CollectibleMovieBasic;
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
    private images: Array<string>;

    constructor(
        private route: ActivatedRoute,
        private routingService: RoutingService,
        private collectibleMovieService: CollectibleMovieApiService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.images = [];
        this.formats = MovieFormats;
        this.route.queryParams.subscribe(params => {
            this.routingParams = this.routingService.getRoutingParams(
                params,
                [RoutingParamKeys.MovieId],
                [RoutingParamKeys.MovieId]
            );
            this.getMovieById();
        });
    }

    ngOnDestroy(): void {
        if (this.collectibleMovieSubscription) this.collectibleMovieSubscription.unsubscribe();
    }

    public onClickImage(): void {
        /* const modalRef = this.modalService.open(ImageModal, { centered: true, size: "lg" });
         (modalRef.componentInstance as ImageModal).items = this.images;
         modalRef.result.then(() => {
 
         }, (reason) => {
 
         });*/
    }

    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {
        let categoryIds = [];
        this.item.categories.forEach(element => {
            categoryIds.push(element._id)
        });
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
            categories: categoryIds,
            year: null,
            format: null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    private getMovieById() {
        if (this.routingParams.hasParam) {
            if (!this.item && this.routingParams[RoutingParamKeys.MovieId]) {
                this.id = this.routingParams[RoutingParamKeys.MovieId];
            }
            this.images = [];
            this.collectibleMovieSubscription = this.collectibleMovieService.getMovieById(this.id).subscribe(
                (response: CollectibleMovieBasic) => {
                    this.item = response;
                    this.imagePath = environment.API_IMAGE_PATH + this.item.frontImage;
                    if (this.item.frontImage)
                        this.images.push(this.item.frontImage);
                    this.initializeOtherProducts();
                }
            );
        }
    }

    private initializeOtherProducts(): void {
        this.otherProductsTitle = "İlgilenebileceğiniz Diğer Filmler"
        this.otherProductsRequest = this.createCollectibleMovieRequest();
        this.showAll = false;
        this.showPagination = true;
        this.centerTitle = true;
        this.centerProducts = true;
        this.dontUseRouting = true;
    }

    public otherProductItemClicked(item: CollectibleMovieBasic): void {
        this.item = item;
        this.id = item._id;
        this.getMovieById();
        window.scroll(0, 0);
    }

}
