import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-image-modal.component',
    templateUrl: './image-modal.component.html',
    styleUrls: ['./image-modal.component.scss']
})

export class ImageModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public items: Array<string>;
    public imagePath: string;
    public selectedImageUrl: string;

    constructor(
        private activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH;
        if (this.items && this.items.length > 0) {
            this.selectedImageUrl = environment.API_IMAGE_PATH + this.items[0];
        }
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

    public onClickImage(url: string): void {
        this.selectedImageUrl = environment.API_IMAGE_PATH + url;
    }
}