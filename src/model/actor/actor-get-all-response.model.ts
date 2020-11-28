import PaginationResponse from '../common/pagination-response.model';
import ActorBasic from './actor-basic.model';

export default interface ActorGetAllResponse {
    actors: Array<ActorBasic>,
    paginationResponse: PaginationResponse
}