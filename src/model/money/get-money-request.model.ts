import { Sort } from 'src/app/enum/sort.enum';
import PaginationRequest from '../common/pagination-request.model';

export default interface GetMoneyRequest {
	productNo: string;
	name: string;
	condition: number;
	serialNo: string;
	minPrice: number;
	maxPrice: number;
	emission: string;
	clipping: number;
	sort: Sort;
	paginationRequest: PaginationRequest
}
