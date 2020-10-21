
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
	HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { HeaderNames } from 'src/constant/header-names.constant';
import { InteractionService } from 'src/service/interaction.service';

const HEADER_SKIP_INTERCEPTOR: string = "X-Skip-Interceptor";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

	constructor(private interactionService: InteractionService) { }

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {

		if (req.headers.has(HEADER_SKIP_INTERCEPTOR)) {
			const headers = req.headers.delete(HEADER_SKIP_INTERCEPTOR);
			return next.handle(req.clone({ headers }));
		}

		let waitingStateActive: boolean = req.headers.get(HeaderNames.WaitingState) === "true";

		this.setWaitingState(waitingStateActive, true);

		return next.handle(req).pipe(
			map(evt => {
				if (evt instanceof HttpResponse) {
					this.setWaitingState(waitingStateActive, false);
				}

				return evt;
			}),
			catchError(error => {
				this.setWaitingState(waitingStateActive, false);
				return observableThrowError(error);
			})
		)
	}

	private setWaitingState(waitingStateActive: boolean, moveToWaitingState: boolean): void {
		if (waitingStateActive) {
			this.interactionService.changeWaitingResponseState(moveToWaitingState);
		}
	}

}