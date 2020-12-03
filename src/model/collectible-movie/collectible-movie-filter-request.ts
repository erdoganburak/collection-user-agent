import { MovieFormat } from 'src/app/enum/movie-format.enum';
import { ProductStatus } from 'src/app/enum/product-status.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import PaginationRequest from '../common/pagination-request.model';
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
    status: ProductStatus;
    stock: number;
    sort: Sort;
    paginationRequest: PaginationRequest;
}