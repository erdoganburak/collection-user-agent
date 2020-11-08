import PaginationRequest from '../common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';

export default interface ClippingGetAllRequest {
    quantity?: number,
    sort: Sort,
    paginationRequest: PaginationRequest
}