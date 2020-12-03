import { Component } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';

@Component({
    selector: 'app-added-to-cart-modal.component',
    templateUrl: './added-to-cart-modal.component.html',
    styleUrls: ['./added-to-cart-modal.component.scss']
})

export class AddedToCartModal extends BaseModalComponent implements IModal {
    constructor(
        private activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit(): void {


    }

    public init(): void {
        super.init();
    }

    public onOkClicked(event: MouseEvent): void {
        this.activeModal.close();
    }

}