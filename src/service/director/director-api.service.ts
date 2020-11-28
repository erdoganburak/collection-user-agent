import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { DirectorApi } from 'src/app/api/director/director.api';
import DirectorBasic from 'src/model/director/director-basic.model';
import DirectorGetAllRequest from 'src/model/director/director-get-all-request.model';
import DirectorGetAllResponse from 'src/model/director/director-get-all-response.model';

@Injectable()
export class DirectorApiService extends BaseService {

	private api: DirectorApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new DirectorApi(this.http, this.sessionService);
	}

	public saveDirector(formData: FormData): Observable<DirectorBasic> {
		return this.api.saveDirector(formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateDirector(directorId: string, formData: FormData): Observable<DirectorBasic> {
		return this.api.updateDirector(directorId, formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getDirectors(request: DirectorGetAllRequest): Observable<DirectorGetAllResponse> {
		return this.api.getDirectors(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getDirectorById(directorId: string): Observable<DirectorBasic> {
		return this.api.getDirectorById(directorId).pipe(catchError((error) => this.handleError(error, [])));
	}

	public deleteDirector(directorId: string): Observable<DirectorBasic> {
		return this.api.deleteDirector(directorId).pipe(catchError((error) => this.handleError(error, [])));
	}


}