import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteractionService } from 'src/service/interaction.service';
import EmissionUpsertRequest from 'src/model/emission/emission-upsert-request.model';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import { ToastrType } from 'src/app/enum/toastr.enum';
@Component({
    selector: 'app-management-emission-upsert-modal.component',
    templateUrl: './management-emission-upsert-modal.component.html',
    styleUrls: ['./management-emission-upsert-modal.component.scss']
})

export class ManagementEmissionUpsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public id: string;
    public data: EmissionUpsertRequest;
    public clippings: Array<ClippingBasic>;

    public emissionForm: FormGroup;
    public submitted = false;
    public selectedItems = [];
    public dropdownSettings: IDropdownSettings = {};

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private emissionService: EmissionApiService,
        private interactionService: InteractionService
    ) {
        super();
    }

    ngOnInit(): void {
        this.emissionForm = this.formBuilder.group({
            name: ['', Validators.required],
            clippings: [],
        });

        if (this.id) {
            this.emissionForm.patchValue(this.data);
        }

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public get controls() { return this.emissionForm.controls; }

    public onSubmit() {
        this.submitted = true;

        if (this.emissionForm.invalid) {
            return;
        }

        const request: EmissionUpsertRequest = {
            name: this.controls.name.value,
            clippings: this.controls.clippings.value
        }

        if (this.id) {
            this.emissionService.updateEmission(this.id, request).subscribe(
                (response: EmissionBasic) => {
                    this.interactionService.showMessage("Emisyon başarıyla güncellendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Emisyon güncellenirken hata oluştu.", ToastrType.Error, "")
                });

        } else {
            this.emissionService.saveEmission(request).subscribe(
                (response: EmissionBasic) => {
                    this.interactionService.showMessage("Emisyon başarıyla eklendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Emisyon eklenirken hata oluştu.", ToastrType.Error, "")
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