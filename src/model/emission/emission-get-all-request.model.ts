import PaginationRequest from '../common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';

export default interface EmissionGetAllRequest {
    sort: Sort,
    paginationRequest: PaginationRequest
}