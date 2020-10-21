import PaginationResponse from '../common/pagination-response.model';
import ClippingBasic from './clipping-basic.model';

export default interface ClippingGetAllResponse {
    clippings: Array<ClippingBasic>,
    paginationResponse: PaginationResponse
}