import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { InteractionService } from 'src/service/interaction.service';


@Component({
	selector: 'app-waiting-response-spinner',
	templateUrl: './waiting-response-spinner.component.html',
	styleUrls: ['./waiting-response-spinner.component.scss']
})
export class WaitingResponseSpinnerComponent implements OnInit, OnDestroy {

	private subscriptionWaitingResponse: Subscription;

	public inWaitingState: boolean;

	constructor(private detector: ChangeDetectorRef,
		private interactionService: InteractionService) { }

	ngOnInit() {
		this.initializeSubscriptions();
	}

	ngOnDestroy() {
		this.subscriptionWaitingResponse.unsubscribe();
	}

	/**
	 * Initializes subscription to listen changes
	 */
	private initializeSubscriptions(): void {

		// Listen changes on waiting response state
		this.subscriptionWaitingResponse = this.interactionService.onWaitingResponseStateChanged.subscribe(
			(state: boolean) => {

				// Update waiting state
				this.inWaitingState = state;

				// Fix for expression check cycle
				this.detector.detectChanges();
			}
		);
	}

}
