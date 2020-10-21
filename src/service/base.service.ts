
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpStatusCode } from 'src/app/enum/api.enum';
import { InteractionService } from './interaction.service';
import { SessionService } from './session.service';

export class BaseService {

	// TODO!

	constructor(protected interactionService: InteractionService, protected sessionService: SessionService) { }

	/**
	 * Handles error and shows related message
	 *
	 * @param error 			Error object
	 * @param customMessages 	Custom i18n messages for error codes, eg. [ { code: 401, message: 'REQUEST.UNAUTHORIZED' } ]
	 * @param defaultMessage 	Default error message for request (optional)
	 */
	protected handleError(error: any, customMessages: Array<any>, defaultMessage?: string) {
		if (!error || !error.status || error.status === 0) {
			//this.interactionService.showMessage('SERVICE_MESSAGES.DEFAULT_ERROR_CONNECTION', ToastrType.Error);
		}
		//else if (error.status === HttpStatusCode.Unauthorized && this.sessionService !== null) {
		//	console.log("base service try refresh token")
		//	this.sessionService.tryRefreshToken().subscribe(
		//		(isLoggedIn: boolean) => {
		//
		//		}
		//	)
		//	}
		else if (customMessages.findIndex(item => item.code === error.status) >= 0) {
			let index = customMessages.findIndex(item => item.code === error.status);

			if (customMessages[index].message) {
				//this.interactionService.showMessage(customMessages[index].message, ToastrType.Error);
			}
		}
		else {
			if (error.status != 400) {
				//this.interactionService.showMessage(error.message, ToastrType.Error);
			} else {
				//this.interactionService.showMessage(defaultMessage ? defaultMessage : 'SERVICE_MESSAGES.DEFAULT_ERROR_RESPONSE', ToastrType.Error);
			}
		}

		// TODO Save error to local storage

		return observableThrowError(error);
	}
}