import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import ClippingUpsertRequest from 'src/model/clipping/clipping-upsert-request.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClippingApiService } from 'src/service/clipping/clipping-api.service';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import { InteractionService } from 'src/service/interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';


@Component({
    selector: 'app-management-clipping-upsert-modal.component',
    templateUrl: './management-clipping-upsert-modal.component.html',
    styleUrls: ['./management-clipping-upsert-modal.component.scss']
})

export class ManagementClippingUpsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public id: string;
    public data: ClippingUpsertRequest;
    public clippingForm: FormGroup;
    public submitted = false;

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private clippingService: ClippingApiService,
        private interactionService: InteractionService
    ) {
        super();
    }

    ngOnInit(): void {
        this.clippingForm = this.formBuilder.group({
            quantity: ['', Validators.required]
        });

        if (this.id) {
            this.clippingForm.patchValue(this.data)
            //this.controls.quantity.setValue(this.data.quantity);
        }
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public get controls() { return this.clippingForm.controls; }

    public onSubmit() {
        this.submitted = true;

        if (this.clippingForm.invalid) {
            return;
        }
        const request: ClippingUpsertRequest = {
            quantity: this.controls.quantity.value
        }
        if (this.id) {
            this.clippingService.updateClipping(this.id, request).subscribe(
                (response: ClippingBasic) => {
                    this.interactionService.showMessage("Küpür başarıyla güncellendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Küpür güncellenirken hata oluştu.", ToastrType.Error, "")
                });

        } else {
            this.clippingService.saveClipping(request).subscribe(
                (response: ClippingBasic) => {
                    this.interactionService.showMessage("Küpür başarıyla eklendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Küpür eklenirken hata oluştu.", ToastrType.Error, "")
                });
        }

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