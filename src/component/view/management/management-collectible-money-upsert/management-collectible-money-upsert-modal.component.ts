import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import { InteractionService } from 'src/service/interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import { FileUpload } from 'src/constant/file-upload.constant';
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-management-collectible-money-upsert-modal.component',
    templateUrl: './management-collectible-money-upsert-modal.component.html',
    styleUrls: ['./management-collectible-money-upsert-modal.component.scss']
})

export class ManagementCollectibleMoneyUpsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public data: CollectibleMoneyBasic;
    public clippings: Array<ClippingBasic>;
    public emissions: Array<EmissionBasic>;

    public moneyForm: FormGroup;
    public submitted = false;

    public dropdownEmissionSettings: IDropdownSettings = {};
    public dropdownClippingSettings: IDropdownSettings = {};
    public selectedEmission: EmissionBasic;
    public selectedClipping: ClippingBasic;

    public errorImageFileSize: string;
    public errorImageFileExtension: string;
    public imageField: string;
    public frontImageSrc;
    public backImageSrc;

    public errorEmissions: string;
    public errorClippings: string;

    private newFrontImage;
    private newBackImage;

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private interactionService: InteractionService,
        private collectibleMoneyService: CollectibleMoneyApiService
    ) {
        super();
    }

    ngOnInit(): void {
        debugger;
        this.moneyForm = this.formBuilder.group({
            productNo: ['', Validators.required],
            name: ['', Validators.required],
            condition: ['', Validators.required],
            serialNo: ['', Validators.required],
            emissions: ['', Validators.required],
            clippings: ['', Validators.required],
            price: ['', Validators.required],
            frontImage: [''],
            backImage: [''],
        });

        if (this.data && this.data._id) {
            this.moneyForm.patchValue(this.data);
            this.selectedEmission = this.data.emission;
            this.selectedClipping = this.data.clipping;
            this.controls.emissions.setValue([this.data.emission]);
            this.controls.clippings.setValue([this.data.clipping]);
            if (this.data.frontImage)
                this.frontImageSrc = environment.API_IMAGE_PATH + this.data.frontImage;
            if (this.data.backImage)
                this.backImageSrc = environment.API_IMAGE_PATH + this.data.backImage;
        }

        this.dropdownEmissionSettings = {
            singleSelection: true,
            idField: '_id',
            textField: 'name',
            itemsShowLimit: 1,
            allowSearchFilter: false,
        };

        this.dropdownClippingSettings = {
            singleSelection: true,
            idField: '_id',
            textField: 'quantity',
            itemsShowLimit: 1,
            allowSearchFilter: false,
            enableCheckAll: false
        };
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    onFileChange(event, field) {
        if (event.target.files.length > 0) {
            this.errorImageFileExtension = null;
            this.errorImageFileSize = null;
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            if (file.size > FileUpload.IMAGE_SIZE) {
                // error
                this.errorImageFileSize = "Resimlerin boyutu en fazla 1 MB olabilir."
            }

            if (file.type === FileUpload.JPG || event.target.files[0].type === FileUpload.JPEG) {

            } else {
                // error
                this.errorImageFileSize = "Resimlerin uzantısı jpg veya jpeg formatında olmalıdır."
            }

            const reader = new FileReader();

            if (this.errorImageFileExtension || this.errorImageFileSize) {
                if (field === "frontImage")
                    this.frontImageSrc = null;
                else if (field === "backImage")
                    this.backImageSrc = null;
                return;
            }

            this.errorImageFileExtension = null;
            this.errorImageFileSize = null;
            if (field === "frontImage") {
                reader.onload = e => this.frontImageSrc = reader.result;
                reader.readAsDataURL(file);
                this.newFrontImage = file;
            } else {
                reader.onload = e => this.backImageSrc = reader.result;
                reader.readAsDataURL(file);
                this.newBackImage = file;
            }

        }
    }

    public get controls() { return this.moneyForm.controls; }

    public onSubmit() {
        this.submitted = true;
        if (this.errorImageFileExtension || this.errorImageFileSize) {
            return;
        }
        if (this.moneyForm.invalid) {
            return;
        }

        if (this.data && this.data._id) {
            this.collectibleMoneyService.updateCollectibleMoney(this.data._id, this.createUpsertRequest()).subscribe(
                (response: CollectibleMoneyBasic) => {
                    this.interactionService.showMessage("Para başarıyla güncellendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Para güncellenirken hata oluştu.", ToastrType.Error, "")
                });

        } else {
            this.collectibleMoneyService.saveCollectibleMoney(this.createUpsertRequest()).subscribe(
                (response: CollectibleMoneyBasic) => {
                    this.interactionService.showMessage("Para başarıyla eklendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Para eklenirken hata oluştu.", ToastrType.Error, "")
                });
        }

    }

    private createUpsertRequest(): FormData {
        let formData = new FormData();
        formData.append('productNo', this.controls.productNo.value);
        formData.append('name', this.controls.name.value);
        formData.append('condition', this.controls.condition.value);
        formData.append('serialNo', this.controls.serialNo.value);
        formData.append('clipping', this.selectedClipping._id);
        formData.append('emission', this.selectedEmission._id);
        formData.append('price', this.controls.price.value);
        if (this.newFrontImage != null) {
            formData.append('frontImage', this.newFrontImage);
            if (this.data && this.data.frontImage)
                formData.append('frontImageId', this.data.frontImage);
        }
        if (this.newBackImage != null) {
            formData.append('backImage', this.newBackImage);
            if (this.data && this.data.backImage)
                formData.append('backImageId', this.data.backImage);
        }
        return formData;
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

    onClippingSelected(item: ClippingBasic) {
        this.selectedClipping = item;
        console.log(item);
    }

    onEmissionSelected(item: EmissionBasic) {
        this.selectedEmission = item;
        console.log(item);
    }

    onEmissionDeSelect(item: EmissionBasic) {
        this.selectedEmission = null;
        console.log(item)
    }

    onClippingDeSelect(item: ClippingBasic) {
        console.log(item)
        this.selectedClipping = null;
    }

}