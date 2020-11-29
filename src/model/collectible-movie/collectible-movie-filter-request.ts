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
    directors: Array<DirectorBasic>;
    actors: Array<ActorBasic>;
    categories: Array<CategoryBasic>;
    sort: Sort;
    paginationRequest: PaginationRequest;
}