import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { EmissionApi } from 'src/app/api/emission/emission.api';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import EmissionUpsertRequest from 'src/model/emission/emission-upsert-request.model';
import EmissionGetAllRequest from 'src/model/emission/emission-get-all-request.model';
import EmissionGetAllResponse from 'src/model/emission/emission-get-all-response.model';

@Injectable()
export class EmissionApiService extends BaseService {

	private api: EmissionApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new EmissionApi(this.http, this.sessionService);
	}

	public saveEmission(request: EmissionUpsertRequest): Observable<EmissionBasic> {
		return this.api.saveEmission(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public deleteEmission(emissionId: string): Observable<EmissionBasic> {
		return this.api.deleteEmission(emissionId).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateEmission(emissionId: string, request: EmissionUpsertRequest): Observable<EmissionBasic> {
		return this.api.updateEmission(emissionId, request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getEmissions(request: EmissionGetAllRequest): Observable<EmissionGetAllResponse> {
		return this.api.getEmissions(request).pipe(catchError((error) => this.handleError(error, [])));
	}

}