import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import ActorBasic from 'src/model/actor/actor-basic.model';
import ActorGetAllRequest from 'src/model/actor/actor-get-all-request.model';
import ActorGetAllResponse from 'src/model/actor/actor-get-all-response.model';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class ActorApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveActor(request: FormData): Observable<ActorBasic> {
		return this.requestFormData(RequestTypes.POST, true, `/actor/save-actor`, request, "ActorBasic");
	}

	public deleteActor(actorId: string): Observable<ActorBasic> {
		return this.request(RequestTypes.DELETE, true, `/actor/delete/${actorId}`, null, "ActorBasic");
	}

	public updateActor(actorId: string, request: FormData): Observable<ActorBasic> {
		return this.requestFormData(RequestTypes.PATCH, true, `/actor/update-actor/${actorId}`, request, "ActorBasic");
	}

	public getActorById(actorId: string): Observable<ActorBasic> {
		return this.request(RequestTypes.GET, false, `/actor/get/${actorId}`, null, "ActorBasic");
	}

	public getActors(request: ActorGetAllRequest): Observable<ActorGetAllResponse> {
		return this.request(RequestTypes.POST, false, `/actor/filter`, request, "ActorGetAllResponse");
	}

}