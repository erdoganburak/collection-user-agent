import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { Pagination } from 'src/constant/pagination.constant';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss']
})

export class MovieComponent implements OnInit, OnDestroy {

    public collectibleMoneys: Array<CollectibleMovieBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public request: CollectibleMovieFilterRequest;
    public showAll: boolean;
    public showPagination: boolean;

    constructor() {
        this.title = "Film Koleksiyonu";
        this.description = "Koleksiyonel filmleri bu sayfadan listeleyebilirsiniz.";
        this.request = this.createCollectibleMovieRequest();
        this.showAll = false;
        this.showPagination = true;
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
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
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
