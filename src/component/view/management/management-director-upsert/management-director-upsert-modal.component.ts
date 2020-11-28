import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteractionService } from 'src/service/interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { FileUpload } from 'src/constant/file-upload.constant';
import { environment } from 'src/environments/environment';
import DirectorBasic from 'src/model/director/director-basic.model';
import { DirectorApiService } from 'src/service/director/director-api.service';

@Component({
    selector: 'app-management-director-upsert-modal.component',
    templateUrl: './management-director-upsert-modal.component.html',
    styleUrls: ['./management-director-upsert-modal.component.scss']
})

export class ManagementDirectorUpsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public data: DirectorBasic;

    public directorForm: FormGroup;
    public submitted = false;
    public errorImageFileSize: string;
    public errorImageFileExtension: string;
    public imageField: string;
    public imageSrc;

    private newImage;

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private interactionService: InteractionService,
        private directorService: DirectorApiService
    ) {
        super();
    }

    ngOnInit(): void {
        this.directorForm = this.formBuilder.group({
            name: ['', Validators.required],
            biography: ['', Validators.required],
            image: [''],
        });

        if (this.data && this.data._id) {
            this.directorForm.patchValue(this.data);

            if (this.data.image)
                this.imageSrc = environment.API_IMAGE_PATH + this.data.image;

        }

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
                this.errorImageFileSize = "Resimlerin boyutu en fazla 1 MB olabilir."
            }

            if (file.type === FileUpload.JPG || event.target.files[0].type === FileUpload.JPEG) {

            } else {
                this.errorImageFileSize = "Resimlerin uzantısı jpg veya jpeg formatında olmalıdır."
            }

            const reader = new FileReader();

            if (this.errorImageFileExtension || this.errorImageFileSize) {
                if (field === "image")
                    this.imageSrc = null;
                return;
            }

            this.errorImageFileExtension = null;
            this.errorImageFileSize = null;
            if (field === "image") {
                reader.onload = e => this.imageSrc = reader.result;
                reader.readAsDataURL(file);
                this.newImage = file;
            }
        }
    }

    public get controls() { return this.directorForm.controls; }

    public onSubmit() {
        this.submitted = true;
        if (this.errorImageFileExtension || this.errorImageFileSize) {
            return;
        }
        if (this.directorForm.invalid) {
            return;
        }

        if (this.data && this.data._id) {
            this.directorService.updateDirector(this.data._id, this.createUpsertRequest()).subscribe(
                (response: DirectorBasic) => {
                    this.interactionService.showMessage("Yönetmen başarıyla güncellendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Yönetmen güncellenirken hata oluştu.", ToastrType.Error, "")
                });

        } else {
            this.directorService.saveDirector(this.createUpsertRequest()).subscribe(
                (response: DirectorBasic) => {
                    this.interactionService.showMessage("Yönetmen başarıyla eklendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("OyYönetmenuncu eklenirken hata oluştu.", ToastrType.Error, "")
                });
        }

    }

    private createUpsertRequest(): FormData {
        let formData = new FormData();
        formData.append('name', this.controls.name.value);
        formData.append('biography', this.controls.biography.value);
        if (this.newImage != null) {
            formData.append('image', this.newImage);
            if (this.data && this.data.image)
                formData.append('image', this.data.image);
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

}