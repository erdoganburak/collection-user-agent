import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import DirectorBasic from 'src/model/director/director-basic.model';
import DirectorGetAllRequest from 'src/model/director/director-get-all-request.model';
import DirectorGetAllResponse from 'src/model/director/director-get-all-response.model';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class DirectorApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveDirector(request: FormData): Observable<DirectorBasic> {
		return this.requestFormData(RequestTypes.POST, true, `/director/save-director`, request, "DirectorBasic");
	}

	public deleteDirector(directorId: string): Observable<DirectorBasic> {
		return this.request(RequestTypes.DELETE, true, `/director/delete/${directorId}`, null, "DirectorBasic");
	}

	public updateDirector(directorId: string, request: FormData): Observable<DirectorBasic> {
		return this.requestFormData(RequestTypes.PATCH, true, `/director/update-director/${directorId}`, request, "DirectorBasic");
	}

	public getDirectorById(directorId: string): Observable<DirectorBasic> {
		return this.request(RequestTypes.GET, false, `/director/get/${directorId}`, null, "DirectorBasic");
	}

	public getDirectors(request: DirectorGetAllRequest): Observable<DirectorGetAllResponse> {
		return this.request(RequestTypes.POST, false, `/director/filter`, request, "DirectorGetAllResponse");
	}

}