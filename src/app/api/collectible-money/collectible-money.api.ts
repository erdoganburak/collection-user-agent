import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import CollectibleMoneyFilterResponse from 'src/model/collectible-money/collectible-money-filter-response';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class CollectibleMoneyApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveCollectibleMoney(request: FormData): Observable<CollectibleMoneyBasic> {
		return this.requestFormData(RequestTypes.POST, true, `/product/save-money`, request, "CollectibleMoneyBasic");
	}

	public updateCollectibleMoney(id: string, request: FormData): Observable<CollectibleMoneyBasic> {
		return this.requestFormData(RequestTypes.PATCH, true, `/product/update-money/${id}`, request, "CollectibleMoneyBasic");
	}

	public getCollectibleMoneys(request: CollectibleMoneyFilterRequest): Observable<CollectibleMoneyFilterResponse> {
		return this.request(RequestTypes.POST, false, `/product/filter`, request, "CollectibleMoneyFilterResponse");
	}

	public getMoneyById(moneyId: string): Observable<CollectibleMoneyBasic> {
		return this.request(RequestTypes.GET, true, `/product/get-money/${moneyId}`, null, "");
	}

}