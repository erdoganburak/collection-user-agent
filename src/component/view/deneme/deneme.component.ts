import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { IModal } from '../../common/modal/modal.interface';
import { BaseModalComponent } from '../../common/modal/base-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-deneme.component',
    templateUrl: './deneme.component.html',
    styleUrls: ['./deneme.component.scss']
})

export class DenemeComponent extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public data: string;

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
        super.init();
    }

    public onCancelClicked(event: MouseEvent): void {
        this.activeModal.dismiss();
    }

    public onOkClicked(event: MouseEvent): void {
        this.activeModal.close();
    }

}