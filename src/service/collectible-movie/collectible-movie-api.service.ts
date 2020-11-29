import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { CollectibleMovieApi } from 'src/app/api/collectible-movie/collectible-movie.api';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import CollectibleMovieFilterResponse from 'src/model/collectible-movie/collectible-movie-filter-response';

@Injectable()
export class CollectibleMovieApiService extends BaseService {

	private api: CollectibleMovieApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new CollectibleMovieApi(this.http, this.sessionService);
	}

	public saveCollectibleMovie(formData: FormData): Observable<CollectibleMovieBasic> {
		return this.api.saveCollectibleMovie(formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateCollectibleMovie(id: string, formData: FormData): Observable<CollectibleMovieBasic> {
		return this.api.updateCollectibleMovie(id, formData).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getCollectibleMovies(request: CollectibleMovieFilterRequest): Observable<CollectibleMovieFilterResponse> {
		return this.api.getCollectibleMovies(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getMovieById(movieId: string): Observable<CollectibleMovieBasic> {
		return this.api.getMovieById(movieId).pipe(catchError((error) => this.handleError(error, [])));
	}

}