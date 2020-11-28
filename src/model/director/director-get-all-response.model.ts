import PaginationResponse from '../common/pagination-response.model';
import DirectorBasic from './director-basic.model';

export default interface DirectorGetAllResponse {
    actors: Array<DirectorBasic>,
    paginationResponse: PaginationResponse
}