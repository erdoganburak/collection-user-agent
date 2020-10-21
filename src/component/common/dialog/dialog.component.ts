import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { IModal } from '../../common/modal/modal.interface';
import { BaseModalComponent } from '../../common/modal/base-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDialogSettings } from './dialog-settings.interface';

@Component({
    selector: 'app-dialog.component',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})

export class DialogComponent extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {
    private _settings: IDialogSettings;   
    
    public get settings(): IDialogSettings {
        return this._settings;
    }
    public set settings(value: IDialogSettings) {
        this._settings = value;
    }

    constructor(
        private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public init(): void {
        if (this._settings){
            if (_.isUndefined(this._settings.showDeclineButton)) this._settings.showDeclineButton = true;
            if (_.isUndefined(this._settings.approveButtonText)) this._settings.approveButtonText = "Tamam";
            if (_.isUndefined(this._settings.declineButtonText)) this._settings.declineButtonText = "Vazgeç";
        }
    console.log(this._settings.showDeclineButton);
       super.init();
    }

    public onCancelClicked(event: MouseEvent): void {
        this.activeModal.dismiss();
    }

    public onOkClicked(event: MouseEvent): void {
        this.activeModal.close();
    }
}