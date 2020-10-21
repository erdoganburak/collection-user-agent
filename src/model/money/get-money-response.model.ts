import { Sort } from 'src/app/enum/sort.enum';
import PaginationResponse from '../common/pagination-response.model';
import MoneyBasic from './money-basic.model';

export default interface GetMoneyResponse {
	moneys: Array<MoneyBasic>;
	paginationResponse: PaginationResponse;
}
