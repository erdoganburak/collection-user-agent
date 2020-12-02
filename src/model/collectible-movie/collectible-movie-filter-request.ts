import { MovieFormat } from 'src/app/enum/movie-format.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import ActorBasic from '../actor/actor-basic.model';
import CategoryBasic from '../category/category-basic.model';
import PaginationRequest from '../common/pagination-request.model';
import DirectorBasic from '../director/director-basic.model';

export default interface CollectibleMovieFilterRequest {
    productType: ProductType;
    condition: number;
    name: string;
    minPrice: number;
    maxPrice: number;
    directors: Array<string>;
    actors: Array<string>;
    categories: Array<string>;
    year: number,
    format: MovieFormat,
    sort: Sort;
    paginationRequest: PaginationRequest;
}