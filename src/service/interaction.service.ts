import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDialogSettings } from 'src/component/common/dialog/dialog-settings.interface';
import { DialogComponent } from 'src/component/common/dialog/dialog.component';

@Injectable()
export class InteractionService {

	private waitingStateCounter: number = 0;

	private sourceWaitingResponseStateChanged = new Subject<boolean>();
	public onWaitingResponseStateChanged = this.sourceWaitingResponseStateChanged.asObservable();

	constructor(private toastrService: ToastrService, private modalService: NgbModal) {

	}

	public showMessage(message: string, type: ToastrType, title: string = ""): void {
		switch (type) {
			case ToastrType.Success:
				this.toastrService.success(message, title);
				break;
			case ToastrType.Info:
				this.toastrService.info(message, title);
				break;
			case ToastrType.Warning:
				this.toastrService.warning(message, title);
				break;
			case ToastrType.Error:
				this.toastrService.error(message, title);
				break;
		}
	}

	public showDialog(settings: IDialogSettings): Promise<any> {
		const modalRef = this.modalService.open(DialogComponent, { centered: true });
		(modalRef.componentInstance as DialogComponent).settings = settings;
		(modalRef.componentInstance as DialogComponent).init();
		return modalRef.result;
	}

	/**
	 * Informs observers application is waiting response from server or similar source
	 *
	 * @param waitingResponse State of waiting response
	 */
	public changeWaitingResponseState(waitingResponse: boolean): void {
		if (waitingResponse) {
			this.waitingStateCounter++;
		}
		else {
			this.waitingStateCounter--;
		}

		if (this.waitingStateCounter < 0) {
			this.waitingStateCounter = 0;
		}

		this.sourceWaitingResponseStateChanged.next(this.waitingStateCounter > 0);
	}

}