import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import ClippingGetAllRequest from 'src/model/clipping/clipping-get-all-request.model';
import ClippingGetAllResponse from 'src/model/clipping/clipping-get-all-response.model';
import ClippingUpsertRequest from 'src/model/clipping/clipping-upsert-request.model';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class ClippingApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveClipping(request: ClippingUpsertRequest): Observable<ClippingBasic> {
		return this.request(RequestTypes.POST, true, `/clipping/save`, request, "ClippingBasic");
	}

	public deleteClipping(clippingId: string): Observable<ClippingBasic> {
		return this.request(RequestTypes.DELETE, true, `/clipping/delete/${clippingId}`, null, "ClippingBasic");
	}

	public updateClipping(clippingId: string, request: ClippingUpsertRequest): Observable<ClippingBasic> {
		return this.request(RequestTypes.PATCH, true, `/clipping/update/${clippingId}`, request, "ClippingBasic");
	}

	public getClippings(request: ClippingGetAllRequest): Observable<ClippingGetAllResponse> {
		return this.request(RequestTypes.POST, false, `/clipping/get-all`, request, "ClippingGetAllResponse");
	}

}