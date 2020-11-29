import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';
import CollectibleMovieFilterResponse from 'src/model/collectible-movie/collectible-movie-filter-response';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class CollectibleMovieApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveCollectibleMovie(request: FormData): Observable<CollectibleMovieBasic> {
		return this.requestFormData(RequestTypes.POST, true, `/product/save-movie`, request, "CollectibleMovieBasic");
	}

	public updateCollectibleMovie(movieId: string, request: FormData): Observable<CollectibleMovieBasic> {
		return this.requestFormData(RequestTypes.PATCH, true, `/product/update-movie/${movieId}`, request, "CollectibleMovieBasic");
	}

	public getCollectibleMovies(request: CollectibleMovieFilterRequest): Observable<CollectibleMovieFilterResponse> {
		return this.request(RequestTypes.POST, false, `/product/filter`, request, "CollectibleMovieFilterResponse");
	}

	public getMovieById(movieId: string): Observable<CollectibleMovieBasic> {
		return this.request(RequestTypes.GET, true, `/product/get-movie/${movieId}`, null, "");
	}

}