import PaginationRequest from '../common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';

export default interface DirectorGetAllRequest {
    name?: string,
    sort: Sort,
    paginationRequest: PaginationRequest
}