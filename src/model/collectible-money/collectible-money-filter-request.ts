import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import PaginationRequest from '../common/pagination-request.model';

export default interface CollectibleMoneyFilterRequest {
    productType: ProductType,
    productNo: string,
    name: string,
    serialNo: string,
    minPrice: number,
    maxPrice: number,
    condition: number,
    clipping: string,
    emission: string,
    sort: Sort,
    paginationRequest: PaginationRequest
}