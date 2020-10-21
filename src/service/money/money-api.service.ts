import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import GetMoneyRequest from 'src/model/money/get-money-request.model';
import GetMoneyResponse from 'src/model/money/get-money-response.model';
import { MoneyApi } from 'src/app/api/money/money.api';
import { SessionService } from '../session.service';

@Injectable()
export class MoneyApiService extends BaseService {

	private api: MoneyApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new MoneyApi(this.http, this.sessionService);
	}

	public getMoneys(request: GetMoneyRequest): Observable<GetMoneyResponse> {
		return this.api.getMoney(request).pipe(catchError((error) => this.handleError(error, [])));
	}

}