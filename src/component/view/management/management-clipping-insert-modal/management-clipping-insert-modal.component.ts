import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InteractionService } from 'src/service/interaction.service';
import EmissionUpsertRequest from 'src/model/emission/emission-upsert-request.model';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import { ToastrType } from 'src/app/enum/toastr.enum';

@Component({
    selector: 'app-management-clipping-insert-modal',
    templateUrl: './management-clipping-insert-modal.component.html',
    styleUrls: ['./management-clipping-insert-modal.component.scss']
})

export class ManagementClippingInsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public emission: EmissionBasic;

    public clippingForm: FormGroup;
    public submitted = false;
    public selectedItems = [];

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private emissionService: EmissionApiService,
        private interactionService: InteractionService
    ) {
        super();
    }

    ngOnInit(): void {
        this.clippingForm = this.formBuilder.group({
            clippings: [],
        });
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

        let clippings = [];
        this.emission.clippings.forEach(c => {
            clippings.push(c._id)
        });
        if (clippings.indexOf(this.controls.clippings.value) === -1) {
            clippings.push(this.controls.clippings.value);
        } else {
            this.interactionService.showMessage("Ekli olan küpür tekrar eklenemez", ToastrType.Error, "")
            this.activeModal.close();
            return;
        }

        const request: EmissionUpsertRequest = {
            name: this.emission.name,
            clippings: clippings
        }

        this.emissionService.updateEmission(this.emission._id, request).subscribe(
            (response: EmissionBasic) => {
                this.interactionService.showMessage("Küpür başarıyla eklendi.", ToastrType.Success, "")
                this.activeModal.close();
            },
            (err) => {
                this.interactionService.showMessage("Küpür eklenirken hata oluştu.", ToastrType.Error, "")
            });

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