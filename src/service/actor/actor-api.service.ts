import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import DirectorBasic from 'src/model/director/director-basic.model';
import { ActorApi } from 'src/app/api/actor/actor.api';
import ActorBasic from 'src/model/actor/actor-basic.model';
import ActorGetAllRequest from 'src/model/actor/actor-get-all-request.model';
import ActorGetAllResponse from 'src/model/actor/actor-get-all-response.model';

@Injectable()
export class ActorApiService extends BaseService {

	private api: ActorApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new ActorApi(this.http, this.sessionService);
	}

	public saveActor(formData: FormData): Observable<ActorBasic> {
		return this.api.saveActor(formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateActor(actorId: string, formData: FormData): Observable<DirectorBasic> {
		return this.api.updateActor(actorId, formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getActors(request: ActorGetAllRequest): Observable<ActorGetAllResponse> {
		return this.api.getActors(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getActorById(actorId: string): Observable<ActorBasic> {
		return this.api.getActorById(actorId).pipe(catchError((error) => this.handleError(error, [])));
	}

	public deleteActor(actorId: string): Observable<ActorBasic> {
		return this.api.deleteActor(actorId).pipe(catchError((error) => this.handleError(error, [])));
	}

}