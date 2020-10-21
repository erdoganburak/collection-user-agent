import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { CollectibleMoneyApi } from 'src/app/api/collectible-money/collectible-money.api';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import CollectibleMoneyFilterResponse from 'src/model/collectible-money/collectible-money-filter-response';

@Injectable()
export class CollectibleMoneyApiService extends BaseService {

	private api: CollectibleMoneyApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new CollectibleMoneyApi(this.http, this.sessionService);
	}

	public saveCollectibleMoney(formData: FormData): Observable<CollectibleMoneyBasic> {
		return this.api.saveCollectibleMoney(formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateCollectibleMoney(id: string, formData: FormData): Observable<CollectibleMoneyBasic> {
		return this.api.updateCollectibleMoney(id, formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getCollectibleMoneys(request: CollectibleMoneyFilterRequest): Observable<CollectibleMoneyFilterResponse> {
		return this.api.getCollectibleMoneys(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getMoneyById(moneyId: string): Observable<CollectibleMoneyBasic> {
		return this.api.getMoneyById(moneyId).pipe(catchError((error) => this.handleError(error, [])));
	}

}