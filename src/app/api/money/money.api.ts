import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import GetMoneyRequest from 'src/model/money/get-money-request.model';
import GetMoneyResponse from 'src/model/money/get-money-response.model';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class MoneyApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public getMoney(request: GetMoneyRequest): Observable<GetMoneyResponse> {
		return this.request(RequestTypes.POST, false, `/money/filter`, request, "GetMoneyResponse");
	}

}