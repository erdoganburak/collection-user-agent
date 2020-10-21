import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import EmissionGetAllRequest from 'src/model/emission/emission-get-all-request.model';
import EmissionGetAllResponse from 'src/model/emission/emission-get-all-response.model';
import EmissionUpsertRequest from 'src/model/emission/emission-upsert-request.model';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class EmissionApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveEmission(request: EmissionUpsertRequest): Observable<EmissionBasic> {
		return this.request(RequestTypes.POST, true, `/emission/save`, request, "EmissionBasic");
	}

	public deleteEmission(emissionId: string): Observable<EmissionBasic> {
		return this.request(RequestTypes.DELETE, true, `/emission/delete/${emissionId}`, null, "EmissionBasic");
	}

	public updateEmission(emissionId: string, request: EmissionUpsertRequest): Observable<EmissionBasic> {
		return this.request(RequestTypes.PATCH, true, `/emission/update/${emissionId}`, request, "EmissionBasic");
	}

	public getEmissions(request: EmissionGetAllRequest): Observable<EmissionGetAllResponse> {
		return this.request(RequestTypes.POST, false, `/emission/get-all`, request, "EmissionGetAllResponse");
	}

}