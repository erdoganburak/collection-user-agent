import PaginationResponse from '../common/pagination-response.model';
import CollectibleMoneyBasic from './collectible-money-basic';

export default interface CollectibleMoneyFilterResponse {
    moneys: Array<CollectibleMoneyBasic>
    paginationResponse: PaginationResponse;
}