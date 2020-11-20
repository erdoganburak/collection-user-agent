import PaginationResponse from '../common/pagination-response.model';
import CategoryBasic from './category-basic.model';

export default interface CategoryGetAllResponse {
    categories: Array<CategoryBasic>,
    paginationResponse: PaginationResponse
}