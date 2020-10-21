import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { ClippingApi } from 'src/app/api/clipping/clipping.api';
import ClippingGetAllResponse from 'src/model/clipping/clipping-get-all-response.model';
import ClippingGetAllRequest from 'src/model/clipping/clipping-get-all-request.model';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import ClippingUpsertRequest from 'src/model/clipping/clipping-upsert-request.model';

@Injectable()
export class ClippingApiService extends BaseService {

	private api: ClippingApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new ClippingApi(this.http, this.sessionService);
	}

	public saveClipping(request: ClippingUpsertRequest): Observable<ClippingBasic> {
		return this.api.saveClipping(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public deleteClipping(clippingId: string): Observable<ClippingBasic> {
		return this.api.deleteClipping(clippingId).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateClipping(clippingId: string, request: ClippingUpsertRequest): Observable<ClippingBasic> {
		return this.api.updateClipping(clippingId, request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getClippings(request: ClippingGetAllRequest): Observable<ClippingGetAllResponse> {
		return this.api.getClippings(request).pipe(catchError((error) => this.handleError(error, [])));
	}

}