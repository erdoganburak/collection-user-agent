import PaginationResponse from '../common/pagination-response.model';
import EmissionBasic from './emission-basic.model';

export default interface EmissionGetAllResponse {
    emissions: Array<EmissionBasic>,
    paginationResponse: PaginationResponse
}