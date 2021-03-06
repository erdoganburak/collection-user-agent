import PaginationRequest from '../common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';

export default interface ActorGetAllRequest {
    name?: string,
    sort: Sort,
    paginationRequest: PaginationRequest
}